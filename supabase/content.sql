-- Detail content for guides and activity ideas (UCalgary).
-- Safe to re-run. Runs after seed.sql (see [db.seed] in config.toml); for the hosted project run:
--   supabase db query --linked -f supabase/content.sql

-- ───────────── Guides ─────────────
update public.guides set body = $$
## From the airport (YYC)
- Calgary Transit Route 300 (MAX/BRT) runs between the airport and downtown. Check the current fare and schedule before you land.
- From downtown, take the CTrain Red Line toward Tuscany and get off at University station (or Brentwood).
- Taxis and rideshare pick up outside Arrivals. Useful if you land late or have heavy bags.

## Getting around Calgary
- The CTrain (light rail) and buses run year-round. Single tickets are valid for 90 minutes.
- Buy tickets in the My Fare app or at CTrain station machines. Activate a mobile ticket just before you board.
- Use the Transit app or Google Maps for real-time arrivals. Winter weather can delay buses.

## U-PASS
- Eligible full-time UCalgary students get a U-PASS for the Fall and Winter terms, paid through student fees and shown in the My Fare app.
- Exchange students: confirm with UCalgary International whether you qualify before buying a monthly pass.
$$,
links = '[{"label":"YYC airport public transit","url":"https://www.yyc.com/en-us/public-transit"},{"label":"Calgary Transit trip planner","url":"https://www.calgarytransit.com/"},{"label":"My Fare app (tickets & U-PASS)","url":"https://www.calgary.ca/content/transit/en/home/fares---passes/my-fare.html"},{"label":"UCalgary International","url":"https://www.ucalgary.ca/live-uc/ucalgary-international"}]'
where slug = 'transport' and university_id = '00000000-0000-4000-8000-000000000001';

update public.guides set body = $$
## What January is like
- Typical January days are around -1°C at best and -13°C overnight, but cold snaps below -30°C (with wind chill) happen.
- Chinooks, warm winds off the Rockies, can lift the temperature by 15–20°C in a few hours, then it drops again.
- It's dry and often sunny. Snow is usually light and powdery.

## What to pack (or buy here)
- An insulated, windproof winter coat that covers your hips.
- Waterproof insulated boots with good grip. Sidewalks get icy.
- A toque (warm hat), a scarf or neck warmer, and insulated gloves or mittens.
- Layers: a thermal base layer and a fleece for outdoor days and trips to the mountains.
- Lip balm and moisturiser. The air is very dry.
- You can buy all of this in Calgary, often on sale in January, if you'd rather not pack it.

## Before you head outside
- Check the official forecast and wind chill, not just the temperature.
- Cover exposed skin when the wind chill is below about -27°C. Frostbite can happen in minutes.
$$,
links = '[{"label":"Calgary forecast (Environment Canada)","url":"https://weather.gc.ca/en/location/index.html?coords=51.046,-114.057"},{"label":"Alberta road conditions (511)","url":"https://511.alberta.ca/"}]'
where slug = 'weather' and university_id = '00000000-0000-4000-8000-000000000001';

update public.guides set body = $$
## Before you fly
- Check your phone is unlocked. A phone locked to your home carrier won't take a Canadian SIM.
- Check it supports eSIM if you want to set up a plan before you land.

## Your options
- **Travel eSIM:** a data-only plan you buy online before you leave. Works the moment you land, but usually no Canadian phone number.
- **Canadian prepaid plan:** gives you a local number, which many Canadian services and banks need for verification codes. Prepaid plans don't need a credit check.
- Compare the major carriers and their lower-cost brands. Read the data limits and roaming terms carefully.
- If you sign up in a store, bring your passport.

## On campus
- UCalgary has eduroam Wi-Fi. If your home university uses eduroam, you can usually log in with your home credentials.
$$,
links = '[{"label":"UCalgary eduroam Wi-Fi","url":"https://www.ucalgary.ca/it/eduroam"}]'
where slug = 'esim' and university_id = '00000000-0000-4000-8000-000000000001';

update public.guides set body = $$
## Getting around
- **Transit:** real-time bus and CTrain arrivals.
- **My Fare:** Calgary Transit tickets and passes, including the U-PASS.
- **Google Maps or Apple Maps:** transit directions work well in Calgary.
- **Uber:** rideshare works in Calgary.

## Weather and roads
- **WeatherCAN:** Environment Canada's official app, with weather alerts.
- **511 Alberta:** highway conditions and closures. Check it before any trip to the Rockies.

## Mountains
- **Parks Canada:** trail conditions, closures and park passes for Banff and other national parks.

## Campus
- **D2L (Brightspace):** UCalgary's course site for slides and assignments.
$$,
links = '[{"label":"My Fare app","url":"https://www.calgary.ca/content/transit/en/home/fares---passes/my-fare.html"},{"label":"511 Alberta","url":"https://511.alberta.ca/"},{"label":"Banff National Park","url":"https://parks.canada.ca/pn-np/ab/banff"}]'
where slug = 'apps' and university_id = '00000000-0000-4000-8000-000000000001';

-- ───────────── Activity ideas ─────────────
update public.activity_ideas set body = $$
## Where to go
- Banff has three ski resorts: Mt Norquay (about 10 minutes from Banff town), Banff Sunshine and Lake Louise. Banff is roughly 1.5 hours' drive west of Calgary.
- Norquay is small and close to town, which makes it an easy first day. Sunshine and Lake Louise are bigger, with more beginner terrain.

## First-timers
- Book a beginner lesson with rental gear. Most resorts sell it as one package, and it's much cheaper booked ahead.
- Dress in layers, with ski goggles, a helmet (usually rentable) and a neck warmer.

## Getting there
- No car? Shuttles run from Calgary to Banff and the resorts. Check the resort sites for current options.
- Stopping anywhere in Banff National Park requires a Parks Canada pass. A yearly Discovery Pass can be worth it if you'll go several times.
- Check 511 Alberta for highway conditions before you leave.
$$,
links = '[{"label":"SkiBig3 (Norquay, Sunshine, Lake Louise)","url":"https://www.skibig3.com/"},{"label":"Mt Norquay","url":"https://banffnorquay.com/"},{"label":"Lake Louise Ski Resort","url":"https://www.skilouise.com/"},{"label":"Banff park passes","url":"https://parks.canada.ca/pn-np/ab/banff/visit/tarifs-fees"}]'
where title = 'First ski day at a Banff resort' and university_id = '00000000-0000-4000-8000-000000000001';

update public.activity_ideas set body = $$
## Johnston Canyon
- In winter, the catwalks along Johnston Canyon in Banff National Park lead to frozen waterfalls.
- It's about 1.2 km to the Lower Falls, and about 2.7 km one way to the Upper Falls.
- It's on the Bow Valley Parkway, west of Banff town.

## Before you go
- Ice cleats (microspikes) are strongly recommended. The trail is packed snow and ice.
- Guided icewalk tours from Banff and Calgary include cleats and transport. Going on your own means you need a car.
- A Parks Canada pass is required to stop in the park.
- Check Parks Canada for trail conditions and 511 Alberta for roads.
$$,
links = '[{"label":"Johnston Canyon (Parks Canada)","url":"https://parks.canada.ca/pn-np/ab/banff/activ/randonee-hiking/johnston"},{"label":"Banff park passes","url":"https://parks.canada.ca/pn-np/ab/banff/visit/tarifs-fees"},{"label":"511 Alberta road conditions","url":"https://511.alberta.ca/"}]'
where title = 'Frozen canyon icewalk' and university_id = '00000000-0000-4000-8000-000000000001';

update public.activity_ideas set body = $$
## Getting there
- Take the CTrain Red Line from University station to downtown. It's about 20 minutes.

## A first-week loop (roughly 5–6 km)
- Walk Stephen Avenue (8 Avenue SW), the pedestrian street with shops and restaurants.
- Head north to Prince's Island Park on the Bow River.
- Cross the red Peace Bridge, then follow the river pathway east.
- Finish in East Village at the RiverWalk and Central Library, then take the CTrain back from City Hall.

## Tips
- The river pathways are cleared in winter but can be icy, so wear boots with grip.
- Free: no tickets needed, just transit fare.
$$,
links = '[{"label":"Prince''s Island Park","url":"https://www.calgary.ca/parks/princes-island-park.html"},{"label":"Calgary pathways & maps","url":"https://www.calgary.ca/bike-walk-roll/pathways.html"},{"label":"Calgary Transit trip planner","url":"https://www.calgarytransit.com/"}]'
where title = 'Downtown + river pathway loop' and university_id = '00000000-0000-4000-8000-000000000001';
