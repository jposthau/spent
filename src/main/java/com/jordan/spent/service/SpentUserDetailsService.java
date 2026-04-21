package com.jordan.spent.service;

import com.jordan.spent.model.SpentPrincipal;
import com.jordan.spent.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class SpentUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public SpentUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("No account for: " + email));
        return new SpentPrincipal(user);
    }
}
