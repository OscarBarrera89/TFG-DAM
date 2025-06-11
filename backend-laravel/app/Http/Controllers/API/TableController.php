<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TableController extends Controller
{
    /**
     * Display a listing of the tables.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $tables = Table::all();
            return response()->json($tables, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cargar las mesas', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created table in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'location' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|string|in:disponible,no_disponible',
        ]);

        $table = Table::create($validated);

        return response()->json($table, 201);
    }

    /**
     * Display the specified table.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $table = Table::findOrFail($id);
            return response()->json($table, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Mesa no encontrada'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cargar la mesa', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified table in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'location' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Error de validación', 'errors' => $validator->errors()], 422);
        }

        try {
            $table = Table::findOrFail($id);
            $table->update([
                'name' => $request->name,
                'capacity' => $request->capacity,
            ]);

            return response()->json($table, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Mesa no encontrada'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar la mesa', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified table from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $table = Table::findOrFail($id);
            $table->delete();
            return response()->json(['message' => 'Mesa eliminada correctamente'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Mesa no encontrada'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar la mesa', 'error' => $e->getMessage()], 500);
        }
    }
}