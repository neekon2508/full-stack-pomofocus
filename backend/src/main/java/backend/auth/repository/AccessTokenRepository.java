package backend.auth.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import backend.auth.model.AccessTokenBlackList;

@Repository
public interface AccessTokenRepository extends CrudRepository<AccessTokenBlackList, String> {

}
