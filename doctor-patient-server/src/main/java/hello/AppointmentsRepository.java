package hello;

import java.math.BigInteger;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface AppointmentsRepository extends CrudRepository<AppointmentsEntity, Long> {
    public List<AppointmentsEntity> findByName(String name);
    public List<AppointmentsEntity> findByAppointmentDate(BigInteger date);
    public List<AppointmentsEntity> findByAppointmentDateBetween(BigInteger date1,BigInteger date2);
    public List<AppointmentsEntity> findByMobileNumber(BigInteger number);
    public List<AppointmentsEntity> findAll();
    @Transactional
    Long deleteById(int id);
    public List<AppointmentsEntity> findByNameAndMobileNumber(String name,BigInteger number);
    public List<AppointmentsEntity> findByNameAndAppointmentDateBetween(String name,BigInteger date1,BigInteger date2);
    public List<AppointmentsEntity> findByMobileNumberAndAppointmentDateBetween(BigInteger number,BigInteger date1,BigInteger date2);
    
    public List<AppointmentsEntity> findByNameAndMobileNumberAndAppointmentDateBetween(String name,BigInteger number,BigInteger date1,BigInteger date2);
    
    // @Query("SELECT t FROM AppointmentsEntity t WHERE t.name = ?1")
    // public List<AppointmentsEntity> findByName(String name);

}
