package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    // Cache verified user IDs to avoid synchronous HTTP call on every request
    private final ConcurrentHashMap<String, Boolean> verifiedUserCache = new ConcurrentHashMap<>();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        // 1. If no Bearer token is present, pass request through (public routes, OPTIONS, etc.)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }

        // 2. Safely parse token claims
        RegisterRequest registerRequest = extractUserDetails(authHeader);
        if (registerRequest == null || registerRequest.getKeycloakId() == null) {
            log.warn("Failed to extract valid user details from Authorization token.");
            return chain.filter(exchange);
        }

        // 3. ALWAYS use Keycloak sub claim as userId — NEVER trust incoming X-User-ID header
        String verifiedUserId = registerRequest.getKeycloakId();

        // 4. Check cache first before making downstream HTTP request
        if (Boolean.TRUE.equals(verifiedUserCache.get(verifiedUserId))) {
            return forwardWithVerifiedHeader(exchange, chain, verifiedUserId);
        }

        return userService.validateUser(verifiedUserId)
                .flatMap(exists -> {
                    if (!exists) {
                        log.info("Syncing new Keycloak user to UserService: {}", verifiedUserId);
                        return userService.registerUser(registerRequest)
                                .doOnSuccess(res -> verifiedUserCache.put(verifiedUserId, true))
                                .then(Mono.empty());
                    } else {
                        verifiedUserCache.put(verifiedUserId, true);
                        return Mono.empty();
                    }
                })
                .then(Mono.defer(() -> forwardWithVerifiedHeader(exchange, chain, verifiedUserId)))
                .onErrorResume(ex -> {
                    log.error("User sync error in gateway filter: {}", ex.getMessage());
                    // Still forward request so gateway doesn't block legitimate traffic on temporary sync hiccups
                    return forwardWithVerifiedHeader(exchange, chain, verifiedUserId);
                });
    }

    private Mono<Void> forwardWithVerifiedHeader(ServerWebExchange exchange, WebFilterChain chain, String verifiedUserId) {
        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header("X-User-ID", verifiedUserId)
                .build();
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private RegisterRequest extractUserDetails(String bearerToken) {
        try {
            String tokenWithoutBearer = bearerToken.substring(7).trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest request = new RegisterRequest();
            request.setKeycloakId(claims.getStringClaim("sub"));
            request.setEmail(claims.getStringClaim("email"));
            request.setFirstName(claims.getStringClaim("given_name"));
            request.setLastName(claims.getStringClaim("family_name"));
            // Avoid static shared passwords: generate a random salt token
            request.setPassword(UUID.randomUUID().toString());
            return request;
        } catch (Exception e) {
            log.error("Error parsing JWT claims: {}", e.getMessage());
            return null;
        }
    }
}