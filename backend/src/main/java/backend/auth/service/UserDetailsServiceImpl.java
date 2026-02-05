package backend.auth.service;

import java.util.stream.Collectors;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import backend.user.model.UserResponseVO;
import backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserResponseVO user = userRepository.findUserByName(username);

        if (user == null)
            throw new UsernameNotFoundException("User not found: " + username);
        if (user.getStatus() != 1)
            throw new DisabledException("Account is locked: " + username);
        return UserDetailsImpl.builder()
                .userId(user.getId())
                .username(username)
                .fullname(user.getFullname())
                .email(user.getEmail())
                .roles(user.getUserRoles())
                
                .build();
    }

}
