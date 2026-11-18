"""The nova's push on the water: the old shader text and the new one (used for the source and for the preview build)."""
OLD = """// The nova pushes the water: a crest of water heaped up at the ring as it runs outwards, the middle pushed
// down and filling back in, and a few waves trailing behind the crest. All of it fades as it spreads.
float novaWave(vec2 p) {
  if (uNova.z < 0.0 || uNova.w <= 0.0) return 0.0;
  float t = uNova.z, d = length(p - uNova.xy), front = t * uNovaSpeed;
  float k = d - front;
  float crest = exp(-k * k / (2.5 + front * 0.15));
  float hollow = -0.9 * exp(-d * d / (front * front * 0.3 + 4.0)) * exp(-t * 1.1);
  float trail = 0.35 * sin(k * 1.3) * exp(k * 0.12) * step(k, 0.0);
  return uNova.w * (crest + hollow + trail) * exp(-t * 0.55) * smoothstep(0.0, 0.08, t);
}
"""
NEW = """// The nova pushes the water: a crest of water heaped up at the ring as it runs outwards, the middle pushed
// down and filling back in, and a few waves trailing behind the crest. All of it fades as it spreads.
// It is not a perfect ring (Markus, 18 Nov: organic, but smooth and fluid, with real variety in the water's
// height): the front runs a little ahead in some directions and behind in others, broad patches of high and
// low water drift along the crest as it runs, and a second, lower swell follows it, high where the first is low.
// Everything here changes slowly from place to place: fast changes showed up as spikes.
float novaWave(vec2 p) {
  if (uNova.z < 0.0 || uNova.w <= 0.0) return 0.0;
  vec2 q = p - uNova.xy;
  float t = uNova.z, d0 = length(q), a = atan(q.y, q.x + 0.0001);
  float lobes = 0.6 * sin(a * 2.0 + 1.7) + 0.4 * sin(a * 3.0 - 0.6);
  float bend = 1.6 * sin(p.x * 0.11 + 1.3) * sin(p.y * 0.09 - 0.7) + 0.8 * sin(p.x * 0.19 - p.y * 0.15 + 0.4);
  float d = d0 + bend * smoothstep(0.0, 8.0, d0), front = t * uNovaSpeed * (1.0 + 0.08 * lobes);
  float k = d - front;
  float tall = 1.0 + 0.45 * sin(p.x * 0.07 + p.y * 0.05 + t * 1.3 + 2.0) + 0.3 * sin(p.x * 0.045 - p.y * 0.085 - t * 0.9) + 0.2 * sin(a * 3.0 + 4.1);
  float crest = exp(-k * k / (4.5 + front * 0.22)) * tall;
  float k2 = d - front * 0.55;
  float swell = 0.45 * exp(-k2 * k2 / (7.0 + front * 0.3)) * (2.0 - tall);
  float hollow = -0.9 * exp(-d0 * d0 / (front * front * 0.3 + 4.0)) * exp(-t * 1.1);
  float trail = 0.3 * sin(k * (0.8 + 0.12 * lobes)) * exp(k * 0.09) * (1.0 - smoothstep(-2.5, 0.0, k)) * (0.5 + 0.5 * tall);
  return uNova.w * (crest + swell + hollow + trail) * exp(-t * 0.55) * smoothstep(0.0, 0.08, t);
}
"""
