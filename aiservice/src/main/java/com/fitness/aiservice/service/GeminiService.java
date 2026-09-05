package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.model}")
    private String geminiModel;

    public GeminiService(
            WebClient.Builder webClientBuilder,
            ObjectMapper objectMapper
    ) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public String getAnswer(String question) {

        Map<String, Object> requestBody = Map.of(
                "model", geminiModel,
                "input", question
        );

        try {
            String response = webClient.post()
                    .uri(geminiApiUrl)
                    .header("x-goog-api-key", geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("RAW GEMINI RESPONSE: {}", response);

            return extractTextFromResponse(response);

        } catch (Exception e) {
            log.error("Error while calling Gemini API", e);
            throw new RuntimeException("Failed to get response from Gemini", e);
        }
    }

    private String extractTextFromResponse(String response) {

        try {
            JsonNode root = objectMapper.readTree(response);

            JsonNode steps = root.path("steps");

            if (!steps.isArray()) {
                throw new RuntimeException(
                        "Invalid Gemini response: 'steps' not found"
                );
            }

            StringBuilder result = new StringBuilder();

            for (JsonNode step : steps) {

                if (!"model_output".equals(step.path("type").asText())) {
                    continue;
                }

                JsonNode content = step.path("content");

                if (!content.isArray()) {
                    continue;
                }

                for (JsonNode contentItem : content) {

                    if ("text".equals(contentItem.path("type").asText())) {

                        String text = contentItem.path("text").asText();

                        if (!text.isBlank()) {
                            result.append(text);
                        }
                    }
                }
            }

            if (result.isEmpty()) {
                throw new RuntimeException(
                        "Gemini returned no text output"
                );
            }

            return result.toString();

        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", response, e);
            throw new RuntimeException(
                    "Failed to parse Gemini response",
                    e
            );
        }
    }
}