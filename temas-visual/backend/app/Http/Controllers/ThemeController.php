<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\Theme;

class ThemeController extends Controller
{
    public function index()
    {
        return response()->json(Theme::all());
    }

    public function store(Request $request)
    {
        $themeName = $request->input('name');
        $themeType = $request->input('type');
        $colors = $request->input('colors');

        // Generar el tema y guardarlo en la base de datos
        $themeData = $this->generateTheme($themeName, $themeType, $colors);

        $theme = new Theme([
            'name' => $themeName,
            'type' => $themeType,
            'theme_data' => $themeData
        ]);

        $theme->save();

        // Devolver la respuesta
        return Response::make(json_encode($theme, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $themeName . '-theme.json"',
        ]);
    }

    public function show($id)
    {
        $theme = Theme::findOrFail($id);
        return response()->json($theme);
    }

    public function destroy($id)
    {
        $theme = Theme::findOrFail($id);
        $theme->delete();
        return response()->json(null, 204);
    }

    private function generateTheme($name, $type, $colors)
    {
        // Basic structure of a VSCode theme
        $theme = [
            'name' => $name,
            'type' => $type,
            'semanticHighlighting' => true,
            'semanticTokenColors' => [
                'enumMember' => ['foreground' => $this->getColor($colors, '--enumMember', '#56b6c2')],
                'variable.constant' => ['foreground' => $this->getColor($colors, '--variable-constant', '#d19a66')],
                'variable.defaultLibrary' => ['foreground' => $this->getColor($colors, '--variable-defaultLibrary', '#e5c07b')]
            ],
            'tokenColors' => [
                [
                    'name' => 'keyword',
                    'scope' => 'keyword',
                    'settings' => ['foreground' => $this->getColor($colors, '--keyword', '#c678dd')]
                ],
                [
                    'name' => 'constant.numeric',
                    'scope' => 'constant.numeric',
                    'settings' => ['foreground' => $this->getColor($colors, '--numbers', '#ff7c00')]
                ],
                [
                    'name' => 'comment',
                    'scope' => 'comment',
                    'settings' => ['foreground' => $this->getColor($colors, '--comments', '#0055ff'), 'fontStyle' => 'italic']
                ]
            ],
            'colors' => [
                'editor.background' => $this->getColor($colors, '--editor-background', '#1e1e1e'),
                'editor.foreground' => $this->getColor($colors, '--editor-foreground', '#d4d4d4'),
                'editorLineNumber.foreground' => $this->getColor($colors, '--editor-line-number-foreground', '#237893'),
                'tab.activeBackground' => $this->getColor($colors, '--tab-active-background', '#1e1e1e'),
                'tab.inactiveBackground' => $this->getColor($colors, '--tab-inactive-background', '#2d2d2d'),
                'tab.border' => $this->getColor($colors, '--tab-border', '#444444'),
                'tab.activeForeground' => $this->getColor($colors, '--tab-active-foreground', '#ffffff'),
                'tab.inactiveForeground' => $this->getColor($colors, '--tab-inactive-foreground', '#aaaaaa'),
                'tab.hoverBackground' => $this->getColor($colors, '--tab-hover-background', '#3d3d3d'),
                'tab.hoverForeground' => $this->getColor($colors, '--tab-hover-foreground', '#ffffff'),
                'sideBar.background' => $this->getColor($colors, '--sidebar-background', '#f3f3f3'),
                'sideBar.foreground' => $this->getColor($colors, '--sidebar-foreground', '#616161'),
                'sideBarSectionHeader.background' => $this->getColor($colors, '--side-bar-section-header-background', '#ffffff'),
                'sideBarSectionHeader.foreground' => $this->getColor($colors, '--side-bar-section-header-foreground', '#6f6f6f'),
                'statusBar.background' => $this->getColor($colors, '--status-bar-background', '#007acc'),
                'statusBar.foreground' => $this->getColor($colors, '--status-bar-foreground', '#ffffff'),
                'titleBar.activeBackground' => $this->getColor($colors, '--top-bar-background', '#2c2c2c'),
                'titleBar.activeForeground' => $this->getColor($colors, '--top-bar-text', '#ffffff'),
                'titleBar.border' => $this->getColor($colors, '--title-bar-border', '#00000000'),
                'activityBar.background' => $this->getColor($colors, '--activity-bar-background', '#2c2c2c'),
                'activityBar.foreground' => $this->getColor($colors, '--activity-bar-foreground', '#ffffff'),
                'activityBar.inactiveForeground' => $this->getColor($colors, '--activity-bar-inactive-foreground', '#ffffff66'),
                'activityBarBadge.foreground' => $this->getColor($colors, '--activity-bar-badge-foreground', '#ffffff'),
                'activityBarBadge.background' => $this->getColor($colors, '--activity-bar-badge-background', '#007acc'),
            ]
        ];

        return $theme;
    }
    private function getColor($colors, $label, $default)
    {
        foreach ($colors as $color) {
            if ($color['label'] === $label) {
                return $color['value'];
            }
        }
        return $default;
    }
}
