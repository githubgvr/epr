package epr.eprapiservices.Services;

import epr.eprapiservices.Models.User;
import epr.eprapiservices.dao.repository.UserRepository;
import epr.eprapiservices.dto.LoginRequestDto;
import epr.eprapiservices.dto.LoginResponseDto;
import epr.eprapiservices.dto.UserDto;
import epr.eprapiservices.exception.BusinessException;
import epr.eprapiservices.security.JwtUtil;
import epr.eprapiservices.util.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service class for authentication operations.
 * Handles user login, token generation, and authentication validation.
 */
@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, UserMapper userMapper, 
                      JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticate user and generate JWT token.
     */
    public LoginResponseDto login(LoginRequestDto loginRequest) {
        // Find user by username
        Optional<User> userOptional = userRepository.findByUserName(loginRequest.getUsername());
        
        if (userOptional.isEmpty()) {
            throw new BusinessException("INVALID_CREDENTIALS", "Invalid username or password");
        }

        User user = userOptional.get();

        // Check if user is active
        if (!user.getIsActive()) {
            throw new BusinessException("USER_INACTIVE", "User account is inactive");
        }

        // For development purposes, we'll use simple password comparison
        // In production, this should use proper password hashing
        if (!isPasswordValid(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("INVALID_CREDENTIALS", "Invalid username or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUserName(), user.getUserId());

        // Convert user to DTO (excluding sensitive information)
        UserDto userDto = userMapper.toDto(user);

        return new LoginResponseDto(token, userDto);
    }

    /**
     * Validate password against stored hash.
     * For development, we'll use simple comparison.
     * In production, use proper password hashing.
     */
    private boolean isPasswordValid(String rawPassword, String storedPassword) {
        // For development - simple comparison
        // TODO: Implement proper password hashing for production
        return rawPassword.equals(storedPassword);
    }

    /**
     * Validate JWT token and return user information.
     */
    @Transactional(readOnly = true)
    public UserDto validateToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new BusinessException("INVALID_TOKEN", "Invalid or expired token");
        }

        String username = jwtUtil.extractUsername(token);
        Optional<User> userOptional = userRepository.findByUserName(username);

        if (userOptional.isEmpty()) {
            throw new BusinessException("USER_NOT_FOUND", "User not found");
        }

        User user = userOptional.get();
        if (!user.getIsActive()) {
            throw new BusinessException("USER_INACTIVE", "User account is inactive");
        }

        return userMapper.toDto(user);
    }

    /**
     * Extract user ID from JWT token.
     */
    public Integer extractUserIdFromToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new BusinessException("INVALID_TOKEN", "Invalid or expired token");
        }
        return jwtUtil.extractUserId(token);
    }
}
