package epr.eprapiservices.Models;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;

/**
 * Base model class providing common fields for all entities.
 */
@MappedSuperclass
public abstract class BaseModel {

	@Column(name = "isActive")
	protected Boolean isActive;

	/**
	 * Automatically set default values before persisting.
	 */
	@PrePersist
	protected void onCreate() {
		if (this.isActive == null) {
			this.isActive = true;
		}
	}

	// Getters and Setters
	public Boolean getIsActive() {
		return isActive != null ? isActive : true;
	}

	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
}
