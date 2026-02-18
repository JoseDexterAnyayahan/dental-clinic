<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json(
            $request->user()->load('client')
        );
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'             => 'sometimes|string|max:100',
            'email'            => 'sometimes|email|unique:users,email,' . $user->id,
            'current_password' => 'required_with:new_password|string',
            'new_password'     => 'nullable|string|min:8|confirmed',
            'phone'            => 'nullable|string|max:20',
            'birthdate'        => 'nullable|date',
            'gender'           => 'nullable|in:male,female,other',
            'address'          => 'nullable|string',
        ]);

        // Update user
        $user->update($request->only(['name', 'email']));

        // Update password if provided
        if ($request->filled('new_password')) {
            if (! Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect.'
                ], 422);
            }
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);
        }

        // Update client profile
        if ($user->client) {
            $user->client->update($request->only([
                'phone', 'birthdate', 'gender', 'address'
            ]));
        }

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => $user->load('client'),
        ]);
    }
}