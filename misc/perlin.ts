import { globals } from "../globals";

type vector = {
    x: number,
    y: number
}

export function create_grid(grid_size:number) {
    var grid:vector[][] = [];
    for(var i=0;i<grid_size+1;i++) {
        grid[i]=[];
        for(var j=0;j<grid_size+1;j++) {
            grid[i][j] = random_vector();
        }
    }
    return grid;
}

function random_vector() {
    var theta = Math.random() * 2 * Math.PI;
    return {x:Math.cos(theta), y:Math.sin(theta)};
}

function interpolate(a:number, b:number, x:number) {
    return (b-a)*smoother_step(x) + a;
}

function smoother_step(x:number) {
    return 6*x**5 - 15*x**4 + 10*x**3;
}

function get_perlin(grid:vector[][], x:number, y:number) {
    var x0 = Math.floor(x);
    var x1 = x0+1;
    var y0 = Math.floor(y);
    var y1 = y0+1;

    var top_left = dot_product_grid(grid, x, y, x0, y0);
    var top_right = dot_product_grid(grid, x, y, x1, y0);
    var bottom_left = dot_product_grid(grid, x, y, x0, y1);
    var bottom_right = dot_product_grid(grid, x, y, x1, y1);

    var interpolate_top = interpolate(top_left, top_right, x-x0);
    var interpolate_bottom = interpolate(bottom_left, bottom_right, x-x0);
    var value = interpolate(interpolate_top, interpolate_bottom, y-y0);
    return value;
}

function dot_product_grid(grid:vector[][], x:number, y:number, ix:number, iy:number) {
    var dx = x-ix;
    var dy = y-iy;
    return (dx*grid[ix][iy].x+dy*grid[ix][iy].y);
}

export function create_map(grid:vector[][], grid_size:number) {
    var map:number[][] = []
    var sample_size = grid_size/(globals.textureRes+1);
    for(var row=0;row<(globals.textureRes+1); row++) {
        map[row]=[];
        for(var column=0;column<(globals.textureRes+1);column++) {
            map[row][column] = get_perlin(grid, sample_size*column, sample_size*row);
        }
    }
    return map;
}

export function create_layered_map(grid:vector[][], grid_size:number, octaves:number, persistance:number, lacunarity:number) {
    var map:number[][] = [];
    var sample_size = grid_size/(globals.textureRes+1);
    var lacunarity_scale_factor = Math.pow(lacunarity, octaves-1);
    for(var row=0;row<(globals.textureRes+1); row++) {
        map[row]=[];
        for(var column=0;column<(globals.textureRes+1);column++) {
            var value = 0;
            var frequency = 1;
            var amplitude = 1;
            for(var i=0; i<octaves; i++) {
                value += get_perlin(grid, sample_size*column*frequency/lacunarity_scale_factor, 
                sample_size*row*frequency/lacunarity_scale_factor) * amplitude;
                amplitude*=persistance;
                frequency*=lacunarity;
            }
            map[row][column] = value;
        }
    }
    return map;
}