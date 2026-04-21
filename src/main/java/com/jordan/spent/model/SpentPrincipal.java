package com.jordan.spent.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class SpentPrincipal implements UserDetails {

    private final User user;

    public SpentPrincipal(User user) {
        this.user = user;
    }

    public User getUser()   { return user; }
    public Long getUserId() { return user.getId(); }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override public String getPassword()              { return user.getPasswordHash(); }
    @Override public String getUsername()              { return user.getEmail(); }
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return user.getStatus() != UserStatus.DENIED; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return user.getStatus() == UserStatus.APPROVED
                                                             || user.getRole()   == UserRole.ADMIN; }
}
