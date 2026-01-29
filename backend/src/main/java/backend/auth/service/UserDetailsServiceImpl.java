package backend.auth.service;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.User;
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

    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserResponseVO user = userRepository.findUserById(username);

        if (user == null)
            throw new UsernameNotFoundException("User not found: " + username);
        if (user.getStatus() == 1)
            throw new DisabledException("Account is locked: " + username);
        return User.builder()
                .username(username)
                .password(user.getPassword())
                .roles(user.getRoleCodes())
                .build();
    }

}
