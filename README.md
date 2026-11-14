# Invisible Heroes

## Run locally

Install Node.js, then in this folder run:

```sh
npm start
```

Open the printed **Phone / host URL** on the host computer. Phones on the same
Wi-Fi can scan the QR code on that page. Allow the server through your firewall
if needed. The game also needs internet access to load its browser libraries and
connect to the public PeerJS signaling service. Stop the server with Ctrl+C.
To use a different local port, run `PORT=8766 npm start`.

The local server serves only the game and its assets. The game itself remains a
static site and can also be hosted on GitHub Pages; Node.js is not needed there.
Each phone chooses one available hero: Geo (drums), Shiva (bass), Cable (guitar),
or Rhodo (chords). Each character can be selected by only one player.

## Play with fewer than four phones

Enable host sound and have every connected player tap Ready. The host can then
choose **Start with simulated players** to fill any empty slots, including all
four slots. A five-second countdown starts. When four real players are ready,
the original automatic start still applies.

Simulated players are labeled `(bot)` and contribute to the team score and
battery. Their timing and occasional misses are determined by the visible
numeric seed. It is randomized for each host page; enter the same seed with the
same occupied slots to reproduce the simulated performance. If a real player
disconnects during the countdown, it is canceled and the simulated slots are
cleared so replacements can join.
On the host screen, the characters bounce on successful notes; a miss interrupts
the movement. During play they perform on a stage overlooking a city whose
windows light up in proportion to the shared battery charge. At the end, a
scoreboard overlays the stage with individual scores, team points, and average
accuracy. You can dismiss it to view the final city.

Each instrument is played on the host only when its player hits a note. Missed
notes and extra taps produce no sound for that part; simulated players follow
the same rule. A late or delayed tap may make the sound arrive after the beat.
The game lasts 30 seconds, repeating the MIDI as needed and stopping partway
through the final repetition. Only notes scheduled before the cutoff count
toward a player's maximum score. Taps must occur before 30 seconds; the final
scoreboard follows after a short allowance for messages already in transit.

On each phone, notes fall in four numbered columns. Tap the matching numbered
button when the bottom of the tile reaches the hit line. The note positions are
randomized independently of the MIDI rhythm, with no consecutive repeats.
Longer tiles are still a single tap, not a hold. Pressing the wrong button
within a note's timing window counts as a miss for the nearest note; extra taps
outside a window do not score. The battery at the top shows the same shared
charge as the host.
