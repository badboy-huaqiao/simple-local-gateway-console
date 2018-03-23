package edgexfoundry.domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@SuppressWarnings("serial")
@EntityListeners(AuditingEntityListener.class)
public class GatewayInfo implements Serializable {
	
	@Id
	@GenericGenerator(name="idGenerator",strategy="uuid")
	@GeneratedValue(generator="idGenerator",strategy=GenerationType.AUTO)
	private String id;
	private String name;
	private String description;
	private String address;
	
	@CreatedDate
	private long created;
	
	@LastModifiedDate
	private long modified;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Long getCreated() {
		return created;
	}
	public void setCreated(long created) {
		this.created = created;
	}
	public Long getModified() {
		return modified;
	}
	public void setModified(long modified) {
		this.modified = modified;
	}
}
