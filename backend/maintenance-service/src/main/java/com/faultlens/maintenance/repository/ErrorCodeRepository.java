package com.faultlens.maintenance.repository;

import com.faultlens.maintenance.entity.ErrorCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ErrorCodeRepository extends JpaRepository<ErrorCode, String> {
}
