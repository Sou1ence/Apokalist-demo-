package com.apokalist.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Entity representing a task item.
 *
 * Each task has a title, optional description, a due date, and a completion flag
 * Used to store and manage user-defined tasks in the application.
 */
@Entity
public class Task {

    /**
     * Primary key. Auto-generated identifier for each task
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Title of the task. Required
     * Should be concise but meaningful (1-100 characters)
     */
    @NotNull(message = "Title cannot be null")
    @Size(min = 1, max = 100, message = "Between 1 and 100 chrs")
    private String title;

    /**
     * Optional description of the task.
     */
    private String description;

    /**
     * Deadline for the task. Required
     * Used to sort and filter tasks based on urgency
     */
    @NotNull(message = "Due date is required")
    @Column(name = "due_date")
    private LocalDate dueDate;

    /**
     * Completion status.
     * true if task is done, false if still pending
     */
    private boolean completed;

    /**
     * Default constructor.
     */
    public Task() {}

    // === Getters & Setters ===

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    // TODO: add description showing animation and logic
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
