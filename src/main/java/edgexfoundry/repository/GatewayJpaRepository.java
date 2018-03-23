package edgexfoundry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import edgexfoundry.domain.GatewayInfo;

public interface GatewayJpaRepository extends JpaRepository<GatewayInfo, String>{
	
}
