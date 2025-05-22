package com.apokalist.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;


    @Column(name = "due_date")
    private LocalDate dueDate;

    private boolean completed;

    // Constructor
    public Task() {}

    // GETTERS И SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
