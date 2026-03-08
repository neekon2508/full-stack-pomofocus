package backend.auth.controller;

import org.springframework.http.HttpStatus;
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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "0. JWT Authentication", description = "JWT API")
public class AuthController {

        private final AuthService authService;

        @PostMapping("/auth/login")
        public ResponseEntity<CommonResponseVO<LoginResponseVO>> login(@Valid @RequestBody LoginRequestVO req,
                        HttpServletResponse response) {

                return new ResponseEntity<>(CommonResponseVO.<LoginResponseVO>builder()
                                .successOrNot(CommonConstants.YES_FLAG)
                                .statusCode(StatusCodeConstants.SUCCESS)
                                .data(authService.login(req, response))
                                .build(), HttpStatus.OK);
        }

        @PostMapping("/auth/refresh")
        public ResponseEntity<CommonResponseVO<LoginResponseVO>> refresh(HttpServletRequest request,
                        HttpServletResponse response) {
                return ResponseEntity.ok(
                                CommonResponseVO.<LoginResponseVO>builder()
                                                .successOrNot(CommonConstants.YES_FLAG)
                                                .statusCode(StatusCodeConstants.SUCCESS)
                                                .data(authService.refresh(request, response))
                                                .build());
        }

        @PostMapping("/auth/logout")
        public ResponseEntity<CommonResponseVO<String>> logout(HttpServletRequest request) {
                return ResponseEntity.ok(
                                CommonResponseVO.<String>builder()
                                                .successOrNot(CommonConstants.YES_FLAG)
                                                .statusCode(StatusCodeConstants.SUCCESS)
                                                .data(authService.logout(request))
                                                .build());
        }
}
