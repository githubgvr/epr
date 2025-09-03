package epr.eprapiservices;

//import java.sql.Connection;



import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class EprApiServicesApplication {

	public static void main(String[] args) {
		  /* String url = "jdbc:sqlserver://SanjayLaptop;databaseName=epr;encrypt=false;trustServerCertificate=true";
	        String Account = "sa";
	        String password = "Password@123";

	        try (Connection conn = DriverManager.getConnection(url, Account, password)) {
	            if (conn.isValid(5)) {
	                System.out.println("✅ JDBC connection is valid!");
	            } else {
	                System.out.println("❌ JDBC connection is NOT valid.");
	            }
	        } catch (SQLException e) {
	            System.out.println("❌ Connection failed: " + e.getMessage());
	        }

		*/
		SpringApplication.run(EprApiServicesApplication.class, args);
	}

}
