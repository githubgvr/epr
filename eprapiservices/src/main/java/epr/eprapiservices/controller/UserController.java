package epr.eprapiservices.controller;

import epr.eprapiservices.dto.UserDto;
import epr.eprapiservices.Services.UserService;
import epr.eprapiservices.util.UserMapper;
import epr.eprapiservices.exception.BusinessException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.util.List;

/**
 * REST Controller for User management operations.
 * Provides CRUD operations for users with proper validation and error handling.
 */
@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

	private final UserService userService;
	private final UserMapper userMapper;

	public UserController(UserService userService, UserMapper userMapper) {
		this.userService = userService;
		this.userMapper = userMapper;
	}

	/**
	 * Get all users.
	 * @return List of user DTOs
	 */
	@GetMapping
	public ResponseEntity<List<UserDto>> getAllUsers() {
		List<UserDto> users = userService.findAllAsDto();
		return ResponseEntity.ok(users);
	}

	/**
	 * Get user by ID.
	 * @param id User ID
	 * @return User DTO if found
	 */
	@GetMapping("/{id}")
	public ResponseEntity<UserDto> getUserById(@PathVariable @Positive Long id) {
		UserDto user = userService.findByIdAsDto(id);
		return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
	}

	/**
	 * Create a new user.
	 * @param userDto User data
	 * @return Created user DTO
	 */
	@PostMapping
	public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
		if (userDto.getUserId() != null) {
			throw new BusinessException("USER_ID_NOT_ALLOWED", "User ID should not be provided when creating a new user");
		}

		UserDto createdUser = userService.createFromDto(userDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
	}

	/**
	 * Update an existing user.
	 * @param id User ID
	 * @param userDto Updated user data
	 * @return Updated user DTO
	 */
	@PutMapping("/{id}")
	public ResponseEntity<UserDto> updateUser(@PathVariable @Positive Long id, @Valid @RequestBody UserDto userDto) {
		UserDto updatedUser = userService.updateFromDto(id, userDto);
		return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();
	}

	/**
	 * Delete a user.
	 * @param id User ID
	 * @return No content response
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable @Positive Long id) {
		boolean deleted = userService.deleteById(id);
		return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}

	/**
	 * Get users by active status.
	 * @param isActive Active status filter
	 * @return List of filtered user DTOs
	 */
	@GetMapping("/by-status")
	public ResponseEntity<List<UserDto>> getUsersByStatus(@RequestParam Boolean isActive) {
		List<UserDto> users = userService.findByActiveStatus(isActive);
		return ResponseEntity.ok(users);
	}
}
