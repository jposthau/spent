package com.jordan.spent.repository;

import com.jordan.spent.model.User;
import com.jordan.spent.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByStatus(UserStatus status);
    List<User> findByStatusNot(UserStatus status);
}
