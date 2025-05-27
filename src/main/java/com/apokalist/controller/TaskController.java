package com.apokalist.controller;

import com.apokalist.model.Task;
import com.apokalist.repository.TaskRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing Task entities
 *
 * Exposes endpoints for basic CRUD operations, plus support for sorting on fetch.
 * All methods interact directly with the TaskRepository.
 */
@RestController
@RequestMapping("/data")
public class TaskController {

    private final TaskRepository repository;

    /**
     * Constructor injecting the TaskRepository
     *
     * @param repository repository for accessing Task data
     */
    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    /**
     * Fetches all tasks with optional sorting.
     *
     * @param sortBy Optional sort parameter:
     *               - "date-asc", "date-desc" — sort by dueDate
     *               - "added-asc", "added-desc" — sort by id (creation order)
     *               - any other value or null — defaults to ascending by id
     * @return list of sorted Task entities
     */
    @GetMapping
    public List<Task> getAll(@RequestParam(required = false) String sortBy) {
        Sort sort = Sort.unsorted();
        if (sortBy != null) {
            switch (sortBy) {
                case "date-asc" -> sort = Sort.by("dueDate").ascending();
                case "date-desc" -> sort = Sort.by("dueDate").descending();
                case "added-asc" -> sort = Sort.by("id").ascending();
                case "added-desc" -> sort = Sort.by("id").descending();
                default -> sort = Sort.by("id").ascending();
            }
        }
        return repository.findAll(sort);
    }

    /**
     * Creates a new task.
     *
     * @param task   Task to create
     * @param result Validation result
     * @return saved Task entity
     * @throws IllegalArgumentException if validation fails
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task create(@Valid @RequestBody Task task, BindingResult result) {
        if (result.hasErrors()) {
            throw new IllegalArgumentException(result.getAllErrors().toString());
        }
        return repository.save(task);
    }

    /**
     * Updates an existing task by ID.
     *
     * @param id     ID of the task to update
     * @param task   New task data
     * @param result Validation result
     * @return updated Task entity
     * @throws IllegalArgumentException if validation fails
     */
    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @Valid @RequestBody Task task, BindingResult result) {
        if (result.hasErrors()) {
            throw new IllegalArgumentException(result.getAllErrors().toString());
        }
        task.setId(id);
        return repository.save(task);
    }

    /**
     * Deletes a task by ID.
     *
     * @param id ID of the task to delete
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    /**
     * Partially updates the "completed" status of a task.
     *
     * @param id          ID of the task to patch
     * @param taskUpdate  Contains the new "completed" status
     * @return updated Task entity
     * @throws RuntimeException if task with given ID is not found
     */
    @PatchMapping("/{id}")
    public Task updateCompleted(@PathVariable Long id, @RequestBody Task taskUpdate) {
        Task existingTask = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        existingTask.setCompleted(taskUpdate.isCompleted());
        return repository.save(existingTask);
    }
}
