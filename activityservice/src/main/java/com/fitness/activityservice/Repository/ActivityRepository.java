package com.fitness.activityservice.Repository;

import com.fitness.activityservice.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActivityRepository extends MongoRepository<Activity, String> {

    List<Activity> getByUserId(String userId);

    List<Activity> getById(String id);
}
