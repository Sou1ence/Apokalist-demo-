package com.apokalist.controller;

import com.apokalist.model.Task;
import com.apokalist.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/data")
public class TaskController {
    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Task> getAll(@RequestParam(required = false) String sortBy) {
        List<Task> tasks = repository.findAll();

        if (sortBy != null) {
            tasks.sort((a, b) ->
                    "date-asc".equals(sortBy)
                            ? a.getDueDate().compareTo(b.getDueDate())
                            : b.getDueDate().compareTo(a.getDueDate())
            );
        }
        return tasks;
    }

    @PostMapping
    public Task create(@RequestBody Task task) {
        return repository.save(task);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task task) {
        task.setId(id);
        return repository.save(task);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}