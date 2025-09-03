package epr.eprapiservices.util;

import epr.eprapiservices.dto.UserDto;
import epr.eprapiservices.Models.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for mapping between User entity and UserDto.
 * Provides conversion methods to separate internal entity structure from API contracts.
 */
@Component
public class UserMapper {

    /**
     * Convert User entity to UserDto.
     * Excludes sensitive information like password hash.
     */
    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        return new UserDto(
            user.getUserId(),
            user.getUserName(),
            user.getFirstName(),
            user.getMiddleName(),
            user.getLastName(),
            user.getEmail(),
            user.getMobile(),
            user.getNationality(),
            user.getIsActive()
        );
    }

    /**
     * Convert UserDto to User entity.
     * Note: This method does not set the password hash for security reasons.
     * Password handling should be done separately with proper encryption.
     */
    public User toEntity(UserDto userDto) {
        if (userDto == null) {
            return null;
        }

        User user = new User();
        user.setUserId(userDto.getUserId());
        user.setUserName(userDto.getUserName());
        user.setFirstName(userDto.getFirstName());
        user.setMiddleName(userDto.getMiddleName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setMobile(userDto.getMobile());
        user.setNationality(userDto.getNationality());
        user.setIsActive(userDto.getIsActive());

        return user;
    }

    /**
     * Update existing User entity with data from UserDto.
     * Preserves existing password hash and audit fields.
     */
    public void updateEntity(User existingUser, UserDto userDto) {
        if (existingUser == null || userDto == null) {
            return;
        }

        existingUser.setUserName(userDto.getUserName());
        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setMiddleName(userDto.getMiddleName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setMobile(userDto.getMobile());
        existingUser.setNationality(userDto.getNationality());
        existingUser.setIsActive(userDto.getIsActive());
    }

    /**
     * Convert list of User entities to list of UserDtos.
     */
    public List<UserDto> toDtoList(List<User> users) {
        if (users == null) {
            return null;
        }

        return users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of UserDtos to list of User entities.
     */
    public List<User> toEntityList(List<UserDto> userDtos) {
        if (userDtos == null) {
            return null;
        }

        return userDtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
