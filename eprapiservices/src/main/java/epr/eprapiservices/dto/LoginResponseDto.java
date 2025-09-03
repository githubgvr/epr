package epr.eprapiservices.dto;

/**
 * DTO for login response containing authentication token and user information.
 */
public class LoginResponseDto {

    private String token;
    private String tokenType = "Bearer";
    private UserDto user;

    // Default constructor
    public LoginResponseDto() {}

    // Constructor with parameters
    public LoginResponseDto(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "LoginResponseDto{" +
                "tokenType='" + tokenType + '\'' +
                ", user=" + user +
                '}';
    }
}
