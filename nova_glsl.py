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
// It is not a perfect ring (Markus, 18 Nov: "more organic, less uniform"): the front runs a little ahead in
// some directions and behind in others, its line is bent by the water it crosses, the crest is tall in places
// and low in others with chop along its top, and the waves behind it are not evenly spaced.
float novaWave(vec2 p) {
  if (uNova.z < 0.0 || uNova.w <= 0.0) return 0.0;
  vec2 q = p - uNova.xy;
  float t = uNova.z, d0 = length(q), a = atan(q.y, q.x + 0.0001);
  float lobes = 0.5 * sin(a * 3.0 + 1.7) + 0.3 * sin(a * 7.0 - 0.6) + 0.2 * sin(a * 13.0 + 2.9);
  float bend = 1.1 * sin(p.x * 0.23 + 1.3) * sin(p.y * 0.19 - 0.7) + 0.6 * sin(p.x * 0.51 - p.y * 0.37 + 0.4);
  float d = d0 + bend * smoothstep(0.0, 6.0, d0), front = t * uNovaSpeed * (1.0 + 0.09 * lobes);
  float k = d - front;
  float tall = 1.0 + 0.4 * sin(a * 5.0 + 4.1) + 0.25 * sin(a * 11.0 - 1.3 + t * 1.5);
  float chop = 1.0 + 0.3 * sin(p.x * 0.9 + p.y * 1.3 + t * 5.0) * sin(p.x * 1.4 - p.y * 0.8 - t * 3.0);
  float crest = exp(-k * k / ((2.5 + front * 0.15) * (1.0 + 0.6 * lobes * lobes))) * tall * chop;
  float hollow = -0.9 * exp(-d0 * d0 / (front * front * 0.3 + 4.0)) * exp(-t * 1.1);
  float trail = 0.35 * sin(k * (1.3 + 0.3 * lobes) + 0.8 * bend) * exp(k * 0.12) * step(k, 0.0) * (0.6 + 0.4 * tall);
  return uNova.w * (crest + hollow + trail) * exp(-t * 0.55) * smoothstep(0.0, 0.08, t);
}
"""
