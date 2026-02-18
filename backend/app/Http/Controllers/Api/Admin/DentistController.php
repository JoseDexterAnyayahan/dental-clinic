<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dentist;
use Illuminate\Http\Request;

class DentistController extends Controller
{
    public function index()
    {
        $dentists = Dentist::orderBy('first_name')->get();

        return response()->json($dentists);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name'     => 'required|string|max:100',
            'last_name'      => 'required|string|max:100',
            'email'          => 'nullable|email|max:191',
            'phone'          => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:150',
            'bio'            => 'nullable|string',
            'is_active'      => 'boolean',
        ]);

        $dentist = Dentist::create($data);

        return response()->json([
            'message' => 'Dentist created successfully.',
            'dentist' => $dentist,
        ], 201);
    }

    public function show(string $id)
    {
        $dentist = Dentist::findOrFail($id);

        return response()->json($dentist);
    }

    public function update(Request $request, string $id)
    {
        $dentist = Dentist::findOrFail($id);

        $data = $request->validate([
            'first_name'     => 'sometimes|string|max:100',
            'last_name'      => 'sometimes|string|max:100',
            'email'          => 'nullable|email|max:191',
            'phone'          => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:150',
            'bio'            => 'nullable|string',
            'is_active'      => 'boolean',
        ]);

        $dentist->update($data);

        return response()->json([
            'message' => 'Dentist updated successfully.',
            'dentist' => $dentist,
        ]);
    }

    public function destroy(string $id)
    {
        $dentist = Dentist::findOrFail($id);
        $dentist->delete();

        return response()->json([
            'message' => 'Dentist deleted successfully.',
        ]);
    }
}