# Little Kindness

Open `index.html` in a browser, or run `python3 -m http.server 8000` and visit http://localhost:8000. No installation or build is needed.

Enter a situation and move through the scene, then talk with the main character. Each reply can change their facial expression and posture. The stage uses flat 2D illustrations with warm outlines, soft pastel fills, tiny faces, and expressive poses. Duckling, bear, blob, sprout, and human characters blink, waddle, and look toward one another on a white background. The canvas renderer works without WebGL or external image assets. The animation respects the browser's reduced-motion preference.

Without an API key, scenes and conversational responses use a small built-in set of rules. Under **Scene settings**, add an OpenAI API key for scenes and replies tailored to your situation and conversation. Select **Remember key on this device** to save it in browser local storage. **Forget saved key** removes it and clears the key field. Saved credentials are not encrypted; use this option only on a trusted device. Keys are sent directly to OpenAI, together with the situation, scene and conversation needed for generation. Conversation text is held in memory and cleared on a successful new scene or page reload. Refreshing retains only the key and model if remembering is enabled.

Press Ctrl+Enter or Cmd+Enter to send a message at the end of a scene.


## Perspective simulation

The **Simulation** tab starts with a neutral community-event workload example prefilled. Four characters represent you, an organizer, a coordinator and a fellow volunteer. Hear their perspectives, explore tradeoffs, then request a conditional proposal. Use the turn controls or Play to watch each round. The transcript and feeling cards track the conversation; add your own input to hear another round from everyone.

With an API key, each role makes its own model request in sequence, reading the preceding discussion. A separate request synthesizes the proposal, unresolved tradeoffs and questions for real people. These voices are imagined, and no message is sent to anyone. Without a key, the sample team situation has a clearly labeled scripted example. Edited situations need an API key; scripted follow-up rounds illustrate questions to explore rather than interpreting arbitrary input. The key settings are shared between tabs. Simulation history stays in the current page only.

The simulation setup supports 1–6 characters. Expand each character card to edit its name and role prompt. Situation and cast changes apply on Start/Restart and do not alter an existing discussion. Customized simulations require an API key; the offline script keeps its original four-role cast.

Both tabs now play automatically after starting. Reading time is based on dialogue length (about 165 words per minute, at least 5.5 seconds per line). Simulation rounds continue automatically through the proposed plan and pause for user input; sending input starts the follow-up playback. Pause/Play and turn controls remain available. The cast appears immediately while AI replies are being generated, and replies are added as they arrive.
# scenes-for-self-compassion
