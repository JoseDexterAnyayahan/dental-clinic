<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:150',
            'description'  => 'nullable|string',
            'duration_mins'=> 'required|integer|min:15',
            'price'        => 'required|numeric|min:0',
            'icon'         => 'nullable|string|max:100',
        ]);

        $service = Service::create([
            ...$request->all(),
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Service created successfully.',
            'service' => $service,
        ], 201);
    }

    public function show(Service $service)
    {
        return response()->json($service);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'name'         => 'sometimes|string|max:150',
            'description'  => 'nullable|string',
            'duration_mins'=> 'sometimes|integer|min:15',
            'price'        => 'sometimes|numeric|min:0',
            'icon'         => 'nullable|string|max:100',
            'is_active'    => 'sometimes|boolean',
        ]);

        if ($request->filled('name')) {
            $request->merge(['slug' => Str::slug($request->name)]);
        }

        $service->update($request->all());

        return response()->json([
            'message' => 'Service updated successfully.',
            'service' => $service,
        ]);
    }

    public function destroy(Service $service)
    {
        $service->update(['is_active' => false]);

        return response()->json([
            'message' => 'Service deactivated successfully.'
        ]);
    }
}