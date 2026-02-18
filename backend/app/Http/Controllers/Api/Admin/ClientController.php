<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('client')
                     ->where('role', 'client');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json($query->paginate(10));
    }

    public function show(User $user)
    {
        return response()->json(
            $user->load(['client', 'client.appointments.service',
                         'client.appointments.dentist'])
        );
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'     => 'sometimes|string|max:100',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'is_active'=> 'sometimes|boolean',
        ]);

        $user->update($request->only(['name', 'email', 'is_active']));

        if ($user->client) {
            $user->client->update($request->only([
                'phone', 'birthdate', 'gender', 'address', 'medical_history'
            ]));
        }

        return response()->json([
            'message' => 'Client updated successfully.',
            'user'    => $user->load('client'),
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Client deleted successfully.'
        ]);
    }
}