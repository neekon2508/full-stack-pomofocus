package backend.auth.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import backend.auth.model.LoginRequestVO;
import backend.auth.model.LoginResponseVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    LoginResponseVO login(LoginRequestVO login, HttpServletResponse response);

    LoginResponseVO refresh(HttpServletRequest request, HttpServletResponse response);

    String logout(HttpServletRequest request);
}
