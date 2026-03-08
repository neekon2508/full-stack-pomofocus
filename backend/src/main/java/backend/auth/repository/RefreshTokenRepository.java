package backend.auth.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import backend.auth.model.RefreshTokenWhiteList;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshTokenWhiteList, String> {

}
