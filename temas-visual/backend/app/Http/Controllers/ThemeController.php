<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use App\Models\Theme;
use ZipArchive;

class ThemeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user) {
            $themes = Theme::where('user_id', $user->id)->get();
            return response()->json($themes);
        }
        return response()->json([], 404);
    }
    public function getUserThemes()
    {
        $user = Auth::user();
        if ($user) {
            $themes = Theme::where('user_id', $user->id)->get();
            return response()->json($themes);
        }
        return response()->json([], 404);
    }

    public function downloadTheme($id)
    {
        $theme = Theme::findOrFail($id);
        return $this->createVsixAndDownload($theme);
    }

    public function downloadLeonardoTheme()
{
    $themePath = public_path('assets/leonardo_theme.json');
    if (!File::exists($themePath)) {
        return response()->json(['error' => 'Leonardo theme not found.'], 404);
    }
    $themeData = json_decode(File::get($themePath), true);

    $imagePath = public_path('/assets/images/leonardo_bg.png');
    $imageData = base64_encode(file_get_contents($imagePath));

    $themeData['backgroundImage'] = 'data:image/png;base64,' . $imageData;

    $theme = (object)[
        'name' => 'Leonardo',
        'type' => $themeData['type'],
        'theme_data' => json_encode($themeData)
    ];
    return $this->createVsixAndDownload($theme);
}

    public function generateAndDownloadTheme(Request $request)
{
    $themeName = $request->input('name');
    $publisherName = $request->input('publisher');
    $description = $request->input('description');
    $themeType = $request->input('type');
    $colors = $request->input('colors');

    // Use leonardo_theme.json if the theme name is "leonardo"
    if ($themeName === 'leonardo') {
        $themeData = json_decode(file_get_contents(public_path('assets/leonardo_theme.json')), true);
    } else {
        // Generate the theme
        $themeData = $this->generateTheme($themeName, $themeType, $colors);
    }

    $tempDir = storage_path('app/temp');
    if (!File::exists($tempDir)) {
        File::makeDirectory($tempDir, 0755, true);
    }

    $themeJsonPath = $tempDir . '/' . str_replace(' ', '_', $themeName) . '-theme.json';
    file_put_contents($themeJsonPath, json_encode($themeData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    $packageJsonPath = $tempDir . '/package.json';
    $packageJsonContent = [
        'name' => strtolower(str_replace(' ', '-', $themeName)),
        'displayName' => $themeName,
        'description' => $description,
        'version' => '1.0.0',
        'publisher' => $publisherName,
        'engines' => [
            'vscode' => '^1.0.0'
        ],
        'contributes' => [
            'themes' => [
                [
                    'label' => $themeName,
                    'uiTheme' => $themeType === 'dark' ? 'vs-dark' : 'vs-light',
                    'path' => './' . str_replace(' ', '_', $themeName) . '-theme.json'
                ]
            ]
        ]
    ];
    file_put_contents($packageJsonPath, json_encode($packageJsonContent, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    $vsixPath = $tempDir . '/' . str_replace(' ', '_', $themeName) . '-theme.vsix';
    $zip = new ZipArchive;
    if ($zip->open($vsixPath, ZipArchive::CREATE) === TRUE) {
        $zip->addFile($packageJsonPath, 'extension/package.json');
        $zip->addFile($themeJsonPath, 'extension/' . str_replace(' ', '_', $themeName) . '-theme.json');
        $zip->close();
    } else {
        return response()->json(['error' => 'Error creating VSIX file.'], 500);
    }

    return response()->download($vsixPath)->deleteFileAfterSend(true);
}
    private function createVsixAndDownload($theme)
    {
        $themeName = str_replace(' ', '_', $theme->name);
        $themeDirectory = storage_path('app/themes/' . $themeName);

        // Asegúrese de que el directorio exista
        if (!File::exists($themeDirectory)) {
            File::makeDirectory($themeDirectory, 0755, true);
        }

        // Crear el archivo JSON del tema
        $themeJsonPath = $themeDirectory . '/' . $themeName . '-theme.json';
        file_put_contents($themeJsonPath, json_encode(json_decode($theme->theme_data), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        // Crear el archivo package.json para el VSIX
        $packageJsonPath = $themeDirectory . '/package.json';
        $packageJsonContent = [
            'name' => strtolower(str_replace(' ', '-', $themeName)),
            'displayName' => $themeName,
            'description' => 'A custom theme generated by your app',
            'version' => '1.0.0',
            'publisher' => 'your-name',
            'engines' => [
                'vscode' => '^1.0.0'
            ],
            'contributes' => [
                'themes' => [
                    [
                        'label' => $themeName,
                        'uiTheme' => $theme->type === 'dark' ? 'vs-dark' : 'vs-light',
                        'path' => './' . $themeName . '-theme.json'
                    ]
                ]
            ]
        ];
        file_put_contents($packageJsonPath, json_encode($packageJsonContent, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        // Crear el archivo VSIX usando ZipArchive
        $vsixPath = storage_path('app/themes/' . $themeName . '-theme.vsix');
        $zip = new ZipArchive;
        if ($zip->open($vsixPath, ZipArchive::CREATE) === TRUE) {
            // Agregar archivos en el directorio extension
            $zip->addFile($packageJsonPath, 'extension/package.json');
            $zip->addFile($themeJsonPath, 'extension/' . $themeName . '-theme.json');
            $zip->close();
        } else {
            return response()->json(['error' => 'Error creating VSIX file.'], 500);
        }

        // Devolver la respuesta
        return response()->download($vsixPath)->deleteFileAfterSend(true);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $themeName = $request->input('name');
        $themeType = $request->input('type');
        $colors = $request->input('colors');

        // Generar el tema y guardarlo en la base de datos
        $themeData = $this->generateTheme($themeName, $themeType, $colors);

        // Verificar si el tema ya existe para el usuario
        $existingThemes = Theme::where('user_id', $user->id)->get();
        foreach ($existingThemes as $existingTheme) {
            if ($existingTheme->name === $themeName && $existingTheme->theme_data === json_encode($themeData)) {
                return response()->json(['message' => 'Theme already exists'], 409);
            }
        }

        $theme = new Theme([
            'user_id' => $user->id,
            'name' => $themeName,
            'type' => $themeType,
            'theme_data' => json_encode($themeData)
        ]);

        $theme->save();

        return response()->json(['message' => 'Theme saved successfully']);
    }

    private function generateTheme($name, $type, $colors)
    {
        $variableMap = [
            '--editor-background' => 'editor.background',
            '--editor-foreground' => 'editor.foreground',
            '--editor-line-number-foreground' => 'editorLineNumber.foreground',
            '--keyword' => 'keyword',
            '--numbers' => 'constant.numeric',
            '--variables-properties' => 'variable.parameter',
            '--function-methods' => 'function',
            '--classes-constants' => 'type',
            '--string' => 'string',
            '--operators-special' => 'keyword.operator',
            '--comments' => 'comment',
            '--foreground' => 'foreground',
            '--tab-active-background' => 'tab.activeBackground',
            '--tab-inactive-background' => 'tab.inactiveBackground',
            '--tab-border' => 'tab.border',
            '--tab-active-foreground' => 'tab.activeForeground',
            '--tabs-container-background' => 'tabContainer.background',
            '--tab-inactive-foreground' => 'tab.inactiveForeground',
            '--tab-hover-background' => 'tab.hoverBackground',
            '--tab-hover-foreground' => 'tab.hoverForeground',
            '--sidebar-background' => 'sideBar.background',
            '--sidebar-foreground' => 'sideBar.foreground',
            '--side-bar-section-header-foreground' => 'sideBarSectionHeader.foreground',
            '--side-bar-section-header-border' => 'sideBarSectionHeader.border',
            '--list-hover-background' => 'list.hoverBackground',
            '--list-hover-foreground' => 'list.hoverForeground',
            '--status-bar-background' => 'statusBar.background',
            '--status-bar-foreground' => 'statusBar.foreground',
            '--status-bar-background-hover' => 'statusBar.hoverBackground',
            '--status-bar-remote-foreground' => 'statusBar.remoteForeground',
            '--top-bar-background' => 'titleBar.activeBackground',
            '--top-bar-text' => 'titleBar.activeForeground',
            '--title-bar-border' => 'titleBar.border',
        ];

        $themeColors = [];
        $tokenColors = [];
        foreach ($colors as $color) {
            if (isset($variableMap[$color['label']])) {
                if (strpos($variableMap[$color['label']], 'tokenColors.') === 0) {
                    $tokenColors[substr($variableMap[$color['label']], 11)] = $color['value'];
                } else {
                    $themeColors[$variableMap[$color['label']]] = $color['value'];
                }
            }
        }

        // Generar colores complementarios o faltantes
        $themeColors = array_merge($themeColors, $this->generateComplementaryColors($themeColors));

        $theme = [
            'name' => $name,
            'type' => $type,
            'colors' => $themeColors,
            'tokenColors' => array_map(function($key, $value) {
                return [
                    'scope' => $key,
                    'settings' => [
                        'foreground' => $value
                    ]
                ];
            }, array_keys($tokenColors), $tokenColors)
        ];

        return $theme;
    }

    private function generateComplementaryColors($existingColors)
    {
        // Aquí puedes generar colores complementarios de manera automática
        // como una simple demostración, se usan colores predefinidos para complementar los ya existentes
        return [
            'editorCursor.foreground' => $existingColors['editor.foreground'] ?? '#aeafad',
            'editor.selectionBackground' => '#264f78',
            'editor.inactiveSelectionBackground' => '#3a3d41',
            'editor.lineHighlightBackground' => '#2a2d2e',
            'editor.findMatchHighlightBackground' => '#515c6a',
            'sideBarTitle.foreground' => '#bbbbbb',
            'sideBarSectionHeader.background' => '#ffffff',
            'statusBar.noFolderBackground' => '#68217a',
            'activityBar.background' => '#333333',
            'activityBar.foreground' => '#ffffff',
            'activityBarBadge.background' => '#007acc',
            'activityBarBadge.foreground' => '#ffffff',
            'scrollbarSlider.background' => '#79797933',
            'scrollbarSlider.hoverBackground' => '#79797944',
            'scrollbarSlider.activeBackground' => '#79797988',
            'editorLineNumber.activeForeground' => '#c6c6c6',
            'panel.background' => '#1e1e1e',
            'panel.border' => '#808080',
            'panelTitle.activeBorder' => '#e7e7e7',
            'panelTitle.activeForeground' => '#e7e7e7',
            'panelTitle.inactiveForeground' => '#e7e7e799',
            'badge.background' => '#007acc',
            'badge.foreground' => '#ffffff',
            'progressBar.background' => '#0e70c0'
        ];
    }
}

