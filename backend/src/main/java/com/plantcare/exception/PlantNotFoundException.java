package com.plantcare.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception thrown when a plant is not found in the database.
 * @ResponseStatus causes Spring to return HTTP 404 automatically.
 *
 * OOP CONCEPT: EXCEPTION HANDLING — extends RuntimeException
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class PlantNotFoundException extends RuntimeException {

    public PlantNotFoundException(String message) {
        super(message);
    }
}
