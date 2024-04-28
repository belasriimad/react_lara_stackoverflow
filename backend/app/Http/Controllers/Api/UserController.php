<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthUserRequest;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Store new user
     */
    public function store(StoreUserRequest $request) 
    {
        //validate the form data
        if($request->validated()) {
            $data = $request->validated();
            //hash the password
            $data['password'] = Hash::make($request->password);
            //create the user
            User::create($data);
            //return the response
            return response()->json([
                'message' => 'Account created successfully'
            ]);
        }
    }

     /**
     * Log in users
     */
    public function auth(AuthUserRequest $request) 
    {
        //validate the form data
        if($request->validated()) {
            //get the user by email
            $user = User::whereEmail($request->email)->first();
            if(!$user || !Hash::check($request->password, $user->password)) {
                //return an error
                throw ValidationException::withMessages([
                    'email' => 'This credentials do not match any of our records'
                ]);
            }else {
                return UserResource::make($user)->additional([
                    'access_token' => $user->createToken('new_user')->plainTextToken,
                    'message' => 'Logged in successfully'
                ]);
            }
        }
    }

    /**
     * Logout users
     */
    public function logout(Request $request)
    {
        //delete the current access token
        $request->user()->currentAccessToken()->delete();
        //return the response
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Update user infos
     */
    public function updateUserInfos(UpdateUserRequest $request) 
    {
        //validate the form data
        if($request->validated()) {
            $data = $request->validated();
            //check if the user upload an image
            if($request->has('image')) {
                if(File::exists($request->user()->image)) {
                    File::delete($request->user()->image);
                }
                $file = $request->file('image');
                $data['image'] = 'storage/users/images/'.$this->saveImage($file);
            }
            //update the user
            $request->user()->update($data);
            //return the response
            return UserResource::make($request->user())->additional([
                'message' => 'Profile updated successfully'
            ]);
        }

    }
    /**
     * Upload images
     */
    public function saveImage($file)
    {
        $file_name = time().'_'.$file->getClientOriginalName();
        $file->storeAs('users/images', $file_name, 'public');
        return $file_name;
    }

    /**
     * Update user password
     */
    public function updateUserPassword(Request $request)
    {
        $request->validate([
            'currentPassword' => 'required|min:6|max:255',
            'newPassword' => 'required|min:6|max:255',
        ]);
        //check if the current password is correct
        if(!Hash::check($request->currentPassword, $request->user()->password)) {
            return response()->json([
                'error' => 'The current password is incorrect'
            ]);
        }else {
            //update the user password 
            $request->user()->update([
                'password' => Hash::make($request->newPassword)
            ]);
            return response()->json([
                'message' => 'Your password has been updated successfully'
            ]);
        }
    }
}
