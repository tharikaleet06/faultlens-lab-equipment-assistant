package com.faultlens.auth.dto;

public class RegisterRequest {
    private String username;
    private String name;
    private String email;
    private String password;
    private String role;
    private String badge;
    private String dept;

    public RegisterRequest() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getDept() { return dept; }
    public void setDept(String dept) { this.dept = dept; }
}
