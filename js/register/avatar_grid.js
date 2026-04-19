export function buildAvatarGrid() {
  var avatarGrid = document.getElementById("avatar-grid");
  var avatarInput = document.getElementById("avatar");

  window.LETRO_CONFIG.AVATARS.forEach(function (avatar, i) {
    var col = document.createElement("div");
    col.className = "col-4";

    var pick = document.createElement("div");
    pick.className = "avatar-pick text-center" + (i === 0 ? " selected" : "");
    if (avatar.background) pick.style.background = avatar.background;

    var emoji = document.createElement("div");
    emoji.className = "emoji-wrap";
    emoji.textContent = avatar.emoji;

    var label = document.createElement("span");
    label.className = "small d-block mt-1";
    label.textContent = avatar.label;

    pick.appendChild(emoji);
    pick.appendChild(label);

    pick.addEventListener("click", function () {
      document.querySelectorAll(".avatar-pick").forEach(function (p) {
        p.classList.remove("selected");
      });
      pick.classList.add("selected");
      if (avatarInput) avatarInput.value = avatar.label;
    });

    col.appendChild(pick);
    avatarGrid.appendChild(col);

    if (i === 0 && avatarInput && !avatarInput.value) {
      avatarInput.value = avatar.label;
    }
  });
}
