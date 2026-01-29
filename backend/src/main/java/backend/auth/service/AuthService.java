package backend.auth.service;

import backend.auth.model.LoginRequestVO;
import backend.auth.model.LoginResponseVO;

public interface AuthService {

    public LoginResponseVO login(LoginRequestVO login);
}
