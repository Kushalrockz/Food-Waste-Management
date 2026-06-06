package com.example.mapper;
import com.example.dto.userregistrationdto;
import com.example.entity.userregistration;
public class userregistrationmapper {
	public static userregistrationdto mapTouserregsitrationdto(userregistration user)
	{
		return new userregistrationdto(
				
				user.getName(),
				user.getEmail(),
				user.getPassword(),
				user.getContact(),
				user.getCity(),
				user.getAddress(),
				user.getRole()
				);
	}
	public static userregistration mapTouserregitration(userregistrationdto userdto)
	{
		return new userregistration(
				
				userdto.getName(),
				userdto.getEmail(),
				userdto.getPassword(),
				userdto.getContact(),
				userdto.getCity(),
				userdto.getAddress(),
				userdto.getRole()
				);
	}

}
