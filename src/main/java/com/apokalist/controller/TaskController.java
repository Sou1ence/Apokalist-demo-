package com.apokalist.controller;

import com.apokalist.model.Task;
import com.apokalist.repository.TaskRepository;
import org.springframework.data.domain.Sort;
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
        Sort sort = Sort.unsorted(); // Domyślnie bez sortowania
        if (sortBy != null) {
            switch (sortBy) {
                case "date-asc":
                    sort = Sort.by("dueDate").ascending();
                    break;
                case "date-desc":
                    sort = Sort.by("dueDate").descending();
                    break;
                case "added-asc":
                    sort = Sort.by("id").ascending();
                    break;
                case "added-desc":
                    sort = Sort.by("id").descending();
                    break;
                default:
                    sort = Sort.by("id").ascending(); // Domyślne sortowanie, np. po ID rosnąco
                    break;
            }
        }
        return repository.findAll(sort);
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