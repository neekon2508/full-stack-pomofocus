package backend.auth.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.auth.model.LoginRequestVO;
import backend.auth.model.LoginResponseVO;
import backend.auth.service.AuthService;
import backend.common.constant.CommonConstants;
import backend.common.constant.StatusCodeConstants;
import backend.common.model.CommonResponseVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "0. JWT Authentication", description = "JWT API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/login")
    public ResponseEntity<CommonResponseVO<LoginResponseVO>> login(@RequestBody LoginRequestVO req,
            HttpServletResponse res) {
        LoginResponseVO response = authService.login(req);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new ResponseEntity<>(CommonResponseVO.<LoginResponseVO>builder()
                .successOrNot(CommonConstants.YES_FLAG)
                .statusCode(StatusCodeConstants.SUCCESS)
                .data(response)
                .build(), HttpStatus.OK);
    }

}
