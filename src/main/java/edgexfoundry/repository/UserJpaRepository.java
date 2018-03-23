package edgexfoundry.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import edgexfoundry.domain.User;

public interface UserJpaRepository {//extends JpaRepository<User,String>{
	
	 User findByName(String name);
}
