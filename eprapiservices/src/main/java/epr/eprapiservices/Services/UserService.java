
package epr.eprapiservices.Services;

import epr.eprapiservices.Models.User;
import epr.eprapiservices.dto.UserDto;
import epr.eprapiservices.dao.repository.UserRepository;
import epr.eprapiservices.util.UserMapper;
import epr.eprapiservices.exception.BusinessException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;
import java.util.Optional;

/**
 * Service class for User entity operations.
 * Provides business logic for user management with proper validation and transaction handling.
 */
@Service
@Validated
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    // Legacy methods for backward compatibility
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User Create(User user) {
        validateUser(user);
        return userRepository.save(user);
    }

    // New DTO-based methods
    @Transactional(readOnly = true)
    public List<UserDto> findAllAsDto() {
        List<User> users = userRepository.findAll();
        return userMapper.toDtoList(users);
    }

    @Transactional(readOnly = true)
    public UserDto findByIdAsDto(@NotNull @Positive Long id) {
        User user = userRepository.findById(id).orElse(null);
        return userMapper.toDto(user);
    }

    public UserDto createFromDto(@Valid UserDto userDto) {
        // Check if username already exists
        if (userRepository.existsByUserName(userDto.getUserName())) {
            throw new BusinessException("USERNAME_EXISTS", "Username already exists: " + userDto.getUserName());
        }

        // Check if email already exists
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new BusinessException("EMAIL_EXISTS", "Email already exists: " + userDto.getEmail());
        }

        User user = userMapper.toEntity(userDto);
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    public UserDto updateFromDto(@NotNull @Positive Long id, @Valid UserDto userDto) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        // Check if username is being changed and if it already exists
        if (!existingUser.getUserName().equals(userDto.getUserName()) &&
            userRepository.existsByUserName(userDto.getUserName())) {
            throw new BusinessException("USERNAME_EXISTS", "Username already exists: " + userDto.getUserName());
        }

        // Check if email is being changed and if it already exists
        if (!existingUser.getEmail().equals(userDto.getEmail()) &&
            userRepository.existsByEmail(userDto.getEmail())) {
            throw new BusinessException("EMAIL_EXISTS", "Email already exists: " + userDto.getEmail());
        }

        userMapper.updateEntity(existingUser, userDto);
        User savedUser = userRepository.save(existingUser);
        return userMapper.toDto(savedUser);
    }

    public boolean deleteById(@NotNull @Positive Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public List<UserDto> findByActiveStatus(Boolean isActive) {
        List<User> users = userRepository.findByIsActive(isActive);
        return userMapper.toDtoList(users);
    }

    private void validateUser(User user) {
        if (user.getUserName() == null || user.getUserName().trim().isEmpty()) {
            throw new BusinessException("INVALID_USERNAME", "Username cannot be empty");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new BusinessException("INVALID_EMAIL", "Email cannot be empty");
        }
    }
}
