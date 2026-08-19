import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
const s = createClient(
    "https://fvujvlnvhlxdxjzyzfpv.supabase.co",
    "sb_publishable_fy1cvZ_6KaROT1GRTXf06A_GyuxdCx0",
  ),
  a = document.getElementById("a"),
  E = (x) =>
    String(x ?? "").replace(
      /[&<>\"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '\"': "&quot;",
          "'": "&#39;",
        })[m],
    ),
  F = (x) =>
    String(x || "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  V = (id) => document.getElementById(id).value.trim();
const checked = (name) =>
  [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (x) => x.value,
  );
const options = (name, values, selected = []) =>
  values
    .map(
      ([value, label]) =>
        `<label class="check"><input type=checkbox name="${name}" value="${value}" ${selected.includes(value) ? "checked" : ""}> ${label}</label>`,
    )
    .join("");
const days = [
  [0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"],
  [4, "Thursday"], [5, "Friday"], [6, "Motzaei Shabbos"],
];
const subjects = [
  ["gemara", "Gemara"], ["chassidus", "Chassidus"], ["halacha", "Halacha"],
  ["mishnayos", "Mishnayos"], ["bar_mitzvah", "Bar Mitzvah Preparation"],
  ["kriah", "Kriah"], ["krias_hatorah", "Krias HaTorah"], ["other", "Other"],
];
function nav(log = false, back = false) {
  return `<div class=w><div class=nav><div class=brand>My<b>Chavrusa</b></div><div>${back ? "<button class=btn id=back>← Back</button>" : ""}<button class=btn id=acct>${log ? "Sign out" : "Sign in"}</button></div></div></div>`;
}
function wire(log = false, backFn = null) {
  if (backFn) back.onclick = backFn;
  acct.onclick = log
    ? async () => {
        await s.auth.signOut();
        home();
      }
    : signin;
}
async function home() {
  let {
    data: { session },
  } = await s.auth.getSession();
  a.innerHTML =
    nav(!!session) +
    `<div class=w><section class=hero><div class=muted>THE RIGHT LEARNING CONNECTION</div><h1>A Chavrusa can make all the difference.</h1><p>Connecting families with the right person to learn with their son.</p>${session ? '<p><button class="btn primary" id=dash>Open dashboard</button></p>' : ""}<div class=choices><div class=choice id=p><h2>I’m Looking for a Chavrusa</h2><p>Find someone to learn with your son — in person or online.</p></div><div class=choice id=c><h2>I’m Available to Learn</h2><p>Create a private Chavrusa profile and offer your time to learn with a Bochur.</p></div></div><p class=privacy>Privacy-first matching • Contact details are never public</p></section><section class=how><div class=muted>HOW IT WORKS</div><h2>Thoughtful matching. Mutual consent. Private by design.</h2><div class=steps><div><b>1</b><h3>Create a request or profile</h3><p>No login is required until the information is complete.</p></div><div><b>2</b><h3>Review matches safely</h3><p>Profiles stay anonymous and every Chavrusa is verified by MyChavrusa.</p></div><div><b>3</b><h3>Connect only when both agree</h3><p>Contact details are shared only after mutual approval.</p></div></div></section></div>`;
  wire(!!session);
  if (session) dash.onclick = route;
  p.onclick = session ? route : parentForm;
  c.onclick = session ? route : chavForm;
}
async function parentForm(draft = {}) {
  let {
    data: { session },
  } = await s.auth.getSession();
  a.innerHTML = nav(!!session, true) + `<div class="card wide"><div class=muted>PARENT REQUEST • NO LOGIN REQUIRED YET</div><h1>Find the right Chavrusa</h1><p class=muted>Complete the request first. You will create an account only at the end.</p><div id=m></div>
  <h2>1. About the Bochur</h2><div class=grid><div class=field><label>Bochur’s First Name</label><input id=boy></div><div class=field><label>Bochur’s Last Name</label><input id=boyLast></div><div class=field><label>Age</label><input id=age type=number min=5 max=30></div><div class=field><label>Current Yeshiva</label><input id=yeshiva></div><div class=field><label>Shiur / Year</label><input id=shiur></div><div class=field><label>Location</label><input id=loc></div><div class=field><label>Preferred Language</label><select id=lang><option>English</option><option>Yiddish</option><option>Hebrew</option><option>No preference</option></select></div></div><p class=privacy>🔒 His name remains private until you choose to connect with a Chavrusa.</p>
  <h2>2. Learning Needs</h2><div class="field"><label>What are you looking for?</label><div class=checkgrid>${options("subjects", subjects, draft.subjects)}</div></div><div class=field id=gemaraBox><label>For Gemara</label><div class=checkgrid>${options("gemara", [["girsa","Girsa"],["iyun","Iyun"],["both","Both"],["skills","Building Gemara Skills"]], draft.gemaraStyles)}</div></div><div class=field><label>Other subject <span class=muted>(if applicable)</span></label><input id=otherSubject></div>
  <h2>3. Schedule</h2><div class=grid><div class=field><label>Online / In Person</label><select id=mode><option value=either>Either</option><option value=in_person>In person</option><option value=online>Online</option></select></div><div class=field><label>Frequency</label><input id=frequency placeholder="e.g. Twice a week"></div><div class=field><label>Session length</label><input id=duration placeholder="e.g. 45 minutes"></div><div class=field><label>Times / Sedarim</label><input id=timePeriod placeholder="e.g. Evenings, after first Seder"></div></div><div class=field><label>Available days</label><div class=checkgrid>${options("days", days.map(([v,l])=>[String(v),l]), (draft.days||[]).map(String))}</div></div>
  <h2>4. Budget & Timing</h2><div class=grid><div class=field><label>Minimum budget <span class=muted>(optional)</span></label><input id=budgetMin type=number min=0 placeholder="$"></div><div class=field><label>Maximum budget <span class=muted>(optional)</span></label><input id=budgetMax type=number min=0 placeholder="$"></div><div class=field><label>Budget preference</label><select id=budgetChoice><option value=flexible>Flexible</option><option value=range>Use the range above</option><option value=discuss>Discuss with Chavrusa</option></select></div><div class=field><label>How soon do you need someone?</label><select id=urgency><option value=urgent>Urgent — As soon as possible</option><option value=within_week>Within a week</option><option value=within_few_weeks>Within a few weeks</option><option value=exploring>Just exploring</option></select></div></div><p class=privacy>Urgency is internal and visible only to MyChavrusa administrators.</p>
  <div class=field><label>Anything else you'd like us to know? <span class=muted>(optional)</span></label><textarea id=notes></textarea></div><div class=msg><b>Privacy:</b> Chavrusas see only limited matching information. Names and contact details stay private until mutual approval.</div><button class="btn primary" id=go>Review Request →</button></div>`;
  wire(!!session, session ? route : home);
  const parentFields = {
    boy: draft.boy, boyLast: draft.boyLast,
    age: draft.age,
    yeshiva: draft.yeshiva, shiur: draft.shiur,
    loc: draft.loc,
    lang: draft.lang,
    mode: draft.mode,
    otherSubject: draft.otherSubject, frequency: draft.frequency,
    duration: draft.duration, timePeriod: draft.timePeriod,
    budgetMin: draft.budgetMin, budgetMax: draft.budgetMax,
    budgetChoice: draft.budgetChoice, urgency: draft.urgency,
    notes: draft.notes,
  };
  Object.entries(parentFields).forEach(([id, value]) => {
    if (value !== undefined && value !== null)
      document.getElementById(id).value = value;
  });
  go.onclick = () => {
    if (!V("boy"))
      return (m.innerHTML =
        '<div class="msg err">Please enter your son’s first name.</div>');
    parentReview({
      kind: "parent", boy: V("boy"), boyLast: V("boyLast"),
      age: +V("age") || null,
      yeshiva: V("yeshiva"), shiur: V("shiur"),
      loc: V("loc"),
      lang: V("lang"),
      mode: V("mode"),
      subjects: checked("subjects"), gemaraStyles: checked("gemara"), otherSubject: V("otherSubject"),
      days: checked("days").map(Number), timePeriod: V("timePeriod"), frequency: V("frequency"), duration: V("duration"),
      budgetMin: +V("budgetMin") || null, budgetMax: +V("budgetMax") || null,
      budgetChoice: V("budgetChoice"), urgency: V("urgency"),
      notes: V("notes"),
    });
  };
}
function parentReview(x) {
  a.innerHTML =
    nav(false, true) +
    `<div class="card wide"><div class=muted>REVIEW</div><h1>Review your request</h1><div class=item><h3 style="margin-top:0">${E(x.boy)} ${E(x.boyLast)}${x.age ? " • Age " + E(x.age) : ""}</h3><p><b>Yeshiva / Shiur:</b> ${E(x.yeshiva || "Not specified")} ${x.shiur ? "• "+E(x.shiur):""}<br><b>Location / Language:</b> ${E(x.loc || "Not specified")} • ${E(x.lang)}<br><b>Learning:</b> ${E(x.subjects.map(F).join(", ") || "Not specified")}${x.gemaraStyles.length ? " — "+E(x.gemaraStyles.map(F).join(", ")):""}<br><b>Schedule:</b> ${E(x.days.map(d=>days.find(([v])=>v===d)?.[1]).filter(Boolean).join(", ") || "Days flexible")} • ${E(x.timePeriod || "Times flexible")} • ${E(x.frequency || "Frequency flexible")}<br><b>Format:</b> ${E(F(x.mode))}<br><b>Budget:</b> ${x.budgetChoice==="range" ? E(`$${x.budgetMin||0}–$${x.budgetMax||0}`) : E(F(x.budgetChoice))}<br><b>Timing:</b> ${E(F(x.urgency))} <span class=privacy>(admin only)</span></p>${x.notes ? `<p><b>Notes:</b> ${E(x.notes)}</p>` : ""}</div><p class=privacy>The Bochur’s identity and urgency are not shown on public match cards.</p><button class=btn id=edit>Edit</button> <button class="btn primary" id=submit>Continue to Account →</button></div>`;
  wire(false, () => parentForm(x));
  edit.onclick = () => parentForm(x);
  submit.onclick = () => continueDraft(x, "parent");
}
async function chavForm(draft = {}) {
  let {
    data: { session },
  } = await s.auth.getSession();
  if (session) return route();
  a.innerHTML = nav(false, true) + `<div class="card wide"><div class=muted>CHAVRUSA PROFILE • NO LOGIN REQUIRED YET</div><h1>I’m Available to Learn</h1><p class=muted>Build your complete profile first. Your contact and verification details remain private.</p><div id=m></div>
  <h2>1. About You</h2><div class=grid><div class=field><label>Profile type</label><select id=type><option value=yungerman>Yungerman</option><option value=eltere_bochur>Eltere Bochur</option><option value=770_bochur>770 Bochur</option><option value=melamed_professional>Melamed / Professional Tutor</option><option value=other>Other</option></select></div><div class=field><label>Age</label><input id=age type=number min=17 max=100></div><div class=field><label>Location</label><input id=loc></div><div class=field><label>Yeshiva / Kollel / Position</label><input id=position></div><div class=field><label>Languages</label><input id=langs placeholder="English, Yiddish, Hebrew"></div><div class=field><label>Age groups you are comfortable with</label><input id=ageGroups placeholder="e.g. Bar Mitzvah, Mesivta, Zal"></div></div><div class=field><label>Learning and one-on-one experience</label><textarea id=bio placeholder="A few useful sentences for parents"></textarea></div>
  <h2>2. Learning</h2><div class=field><label>What would you be comfortable learning?</label><div class=checkgrid>${options("subjects", subjects, draft.subjects)}</div></div><div class=field><label>For Gemara</label><div class=checkgrid>${options("gemara", [["girsa","Girsa"],["iyun","Iyun"],["both","Both"],["skills","Building Gemara Skills"]], draft.gemaraStyles)}</div></div><div class=field><label>Other subject <span class=muted>(if applicable)</span></label><input id=otherSubject></div>
  <h2>3. Availability & Rate</h2><div class=grid><div class=field><label>Learning format</label><select id=mode><option value=either>Either</option><option value=in_person>In person</option><option value=online>Online</option></select></div><div class=field><label>In-person area <span class=muted>(optional)</span></label><input id=inPersonArea></div><div class=field><label>Frequency</label><input id=frequency placeholder="e.g. Twice a week"></div><div class=field><label>Times / Sedarim</label><input id=timePeriod placeholder="e.g. Evenings"></div><div class=field><label>Rate type</label><select id=rateType><option value=flexible>Flexible</option><option value=hourly>Hourly</option><option value=per_seder>Per Seder</option><option value=monthly>Monthly</option></select></div><div class=field><label>Rate amount <span class=muted>(optional)</span></label><input id=rate type=number min=0 placeholder="$"></div></div><div class=field><label>Available days</label><div class=checkgrid>${options("days", days.map(([v,l])=>[String(v),l]), (draft.days||[]).map(String))}</div></div>
  <h2>4. Privacy & Live Preview</h2><div class=field><label>Profile privacy</label><select id=visibility><option value=anonymous>Anonymous — Recommended</option><option value=private>Private — Admin suggestions only</option><option value=first_name_visible>First Name Visible</option></select><p class=privacy>Full name, phone and email are never displayed on the match card.</p></div>
  <h2>5. Verification</h2><p class=privacy>MyChavrusa verifies profiles for safety. The reference is private and never appears on your profile.</p><div class=grid><div class=field><label>Reference Full Name</label><input id=refName></div><div class=field><label>Position / Title</label><input id=refTitle></div><div class=field><label>Yeshiva / Kollel / Organization</label><input id=refOrg></div><div class=field><label>Relationship to You</label><input id=refRelationship></div><div class=field><label>Phone Number</label><input id=refPhone type=tel></div><div class=field><label>Email <span class=muted>(optional)</span></label><input id=refEmail type=email></div></div><button class="btn primary" id=go>Open Live Preview →</button></div>`;
  wire(false, home);
  const chavFields = {
    type: draft.type,
    age: draft.age,
    loc: draft.loc,
    position: draft.position,
    mode: draft.mode,
    rate: draft.rate, rateType: draft.rateType, inPersonArea: draft.inPersonArea,
    frequency: draft.frequency, timePeriod: draft.timePeriod,
    langs: draft.langs?.join(", "),
    bio: draft.bio, ageGroups: draft.ageGroups, otherSubject: draft.otherSubject,
    visibility: draft.visibility,
    refName: draft.referenceName,
    refTitle: draft.referenceTitle, refOrg: draft.referenceOrganization,
    refRelationship: draft.referenceRelationship,
    refPhone: draft.referencePhone,
    refEmail: draft.referenceEmail,
  };
  Object.entries(chavFields).forEach(([id, value]) => {
    if (value !== undefined && value !== null)
      document.getElementById(id).value = value;
  });
  go.onclick = () => {
    let chosenSubjects = checked("subjects");
    if (!V("refName") || !V("refPhone"))
      return (m.innerHTML =
        '<div class="msg err">Please provide a reference name and phone number for verification.</div>');
    chavPreview({
      kind: "chavrusa",
      type: V("type"),
      age: +V("age") || null,
      loc: V("loc"),
      position: V("position"),
      mode: V("mode"),
      rate: +V("rate") || null, rateType: V("rateType"), inPersonArea: V("inPersonArea"),
      days: checked("days").map(Number), timePeriod: V("timePeriod"), frequency: V("frequency"),
      langs: V("langs")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      subjects: chosenSubjects, gemaraStyles: checked("gemara"), otherSubject: V("otherSubject"),
      bio: V("bio"), ageGroups: V("ageGroups"),
      visibility: V("visibility"),
      referenceName: V("refName"),
      referenceTitle: V("refTitle"), referenceOrganization: V("refOrg"), referenceRelationship: V("refRelationship"),
      referencePhone: V("refPhone"),
      referenceEmail: V("refEmail"),
    });
  };
}
function chavPreview(x) {
  let dn =
    x.visibility === "private"
      ? "Private Profile"
      : x.visibility === "first_name_visible"
        ? "Your first name"
        : F(x.type);
  a.innerHTML =
    nav(false, true) +
    `<div class="card wide"><div class=muted>LIVE PREVIEW</div><h1>Exactly what a parent will see</h1><p class=muted>${x.visibility === "anonymous" ? "Recommended: your identity stays hidden." : x.visibility === "private" ? "This profile is visible only to Admin for assisted suggestions." : "Only your first name will be visible after account creation."}</p><div class="item profile-preview"><div class=row><div><h3 style="margin:0 0 6px">${E(dn)} • ${E(x.loc || "Location not listed")}</h3><div class=muted>${E(x.subjects.map(F).join(" • ") || "Learning subjects not listed")}</div></div><span class=badge>${x.rate ? E(F(x.rateType))+" • $"+E(x.rate) : "Rate flexible"}</span></div>${x.bio ? `<p>${E(x.bio)}</p>` : ""}<p class=privacy>${E(x.timePeriod || "Times flexible")} • ${E(F(x.mode))}${x.ageGroups ? " • Age groups: "+E(x.ageGroups):""}</p>${x.langs.length ? `<p class=privacy><b>Languages:</b> ${x.langs.map(E).join(", ")}</p>` : ""}<p><span class=verify>○ Identity Verification Pending</span> <span class=verify>○ Reference Check Pending</span></p></div><p class=privacy>Full name, phone, email and reference information are not displayed.</p><button class=btn id=edit>Edit Profile</button> <button class="btn primary" id=publish>Continue to Account →</button></div>`;
  wire(false, () => chavForm(x));
  edit.onclick = () => chavForm(x);
  publish.onclick = () => continueDraft(x, "chavrusa");
}
async function continueDraft(x, role) {
  let {
    data: { session },
  } = await s.auth.getSession();
  localStorage.setItem("mc_pending", JSON.stringify(x));
  if (session) {
    try {
      await finishPending(session.user.id);
      return route();
    } catch (e) {
      return alert(e.message);
    }
  }
  accountGate(role);
}
function accountGate(role) {
  a.innerHTML =
    nav(false, true) +
    `<div class=card><div class=muted>STEP 3 OF 3</div><h1>${role === "parent" ? "Save & submit your request" : "Save & publish your profile"}</h1><p class=muted>You’re almost done. Create your account now so you can manage ${role === "parent" ? "matches and connections" : "requests and connections"}.</p><div id=m></div><div class=grid><div class=field><label>First name</label><input id=fn></div><div class=field><label>Last name</label><input id=ln></div><div class=field><label>Email</label><input id=email type=email></div><div class=field><label>Phone</label><input id=phone></div></div><div class=field><label>Create password</label><input id=pw type=password></div><button class="btn primary" id=create>Create Account & ${role === "parent" ? "Submit" : "Publish"}</button><p class=privacy>Already have an account? <button class=btn id=existing>Sign in instead</button></p></div>`;
  wire(false, () => (role === "parent" ? parentForm() : chavForm()));
  existing.onclick = signin;
  create.onclick = async () => {
    if (!V("fn") || !V("email") || !V("pw"))
      return (m.innerHTML =
        '<div class="msg err">Please complete your name, email and password.</div>');
    let { data, error } = await s.auth.signUp({
      email: V("email"),
      password: V("pw"),
      options: {
        emailRedirectTo: location.origin,
        data: {
          role,
          first_name: V("fn"),
          last_name: V("ln"),
          phone: V("phone"),
        },
      },
    });
    if (error) {
      const rateLimited = /rate limit/i.test(error.message || "");
      return (m.innerHTML = `<div class="msg err">${rateLimited ? "Verification emails are temporarily limited. Your completed form is safely saved on this device. Wait and press this same button again later — do not refill the form." : E(error.message)}</div>`);
    }
    if (data.session) {
      try {
        await finishPending(data.user.id);
        route();
      } catch (e) {
        m.innerHTML = `<div class="msg err">${E(e.message)}</div>`;
      }
    } else {
      m.innerHTML =
        '<div class="msg ok">Account created. Please confirm your email, then sign in. Your completed information is saved on this device and will be submitted after sign-in.</div><button class="btn" id=resend>Resend verification email</button>';
      resend.onclick = async () => {
        resend.disabled = true;
        const { error } = await s.auth.resend({ type: "signup", email: V("email"), options: { emailRedirectTo: location.origin } });
        m.innerHTML = error ? `<div class="msg err">${E(error.message)}</div>` : '<div class="msg ok">Verification email sent again.</div>';
      };
    }
  };
}
async function finishPending(uid) {
  let x = JSON.parse(localStorage.getItem("mc_pending") || "null");
  if (!x) return;
  if (x.kind === "parent") {
    let { error } = await s.rpc("submit_parent_request_v2", { p_payload: x });
    if (error) throw error;
  } else {
    let { error } = await s.rpc("submit_chavrusa_profile_v3", { p_payload: x });
    if (error) throw error;
  }
  localStorage.removeItem("mc_pending");
}
function signin() {
  a.innerHTML =
    nav(false, true) +
    `<div class=card><h1>Sign in</h1><div id=m></div><div class=field><label>Email</label><input id=email type=email></div><div class=field><label>Password</label><input id=pw type=password></div><button class="btn primary" id=go>Sign in</button> <button class=btn id=reset>Forgot password?</button></div>`;
  wire(false, home);
  go.onclick = async () => {
    let { data, error } = await s.auth.signInWithPassword({
      email: V("email"),
      password: V("pw"),
    });
    if (error)
      return (m.innerHTML = `<div class="msg err">${E(error.message)}</div>`);
    try {
      await finishPending(data.user.id);
    } catch (x) {
      return (m.innerHTML = `<div class="msg err">Signed in, but setup needs attention: ${E(x.message)}</div>`);
    }
    route();
  };
  reset.onclick = async () => {
    if (!V("email"))
      return (m.innerHTML =
        '<div class="msg err">Enter your email first.</div>');
    let { error } = await s.auth.resetPasswordForEmail(V("email"), {
      redirectTo: location.origin + "?recovery=1",
    });
    m.innerHTML = error
      ? `<div class="msg err">${E(error.message)}</div>`
      : '<div class="msg ok">Reset email sent.</div>';
  };
}
function recoveryScreen() {
  a.innerHTML =
    nav(false) +
    `<div class=card><h1>Choose a new password</h1><div id=m></div><div class=field><label>New password</label><input id=npw type=password></div><button class="btn primary" id=savepw>Update password</button></div>`;
  wire(false);
  savepw.onclick = async () => {
    if (V("npw").length < 6)
      return (m.innerHTML =
        '<div class="msg err">Password must be at least 6 characters.</div>');
    let { error } = await s.auth.updateUser({ password: V("npw") });
    if (error)
      return (m.innerHTML = `<div class="msg err">${E(error.message)}</div>`);
    history.replaceState({}, "", location.pathname);
    m.innerHTML = '<div class="msg ok">Password updated.</div>';
    setTimeout(route, 500);
  };
}
function adminBootstrapScreen() {
  a.innerHTML =
    nav(false, true) +
    `<div class=card><div class=muted>ADMIN SETUP</div><h1>Create the first Admin account</h1><p class=muted>This protected setup works only for the email address authorized in the database. It does not create a Parent or Chavrusa profile.</p><div id=m></div><div class=grid><div class=field><label>First name</label><input id=fn autocomplete=given-name></div><div class=field><label>Last name</label><input id=ln autocomplete=family-name></div></div><div class=field><label>Authorized email</label><input id=email type=email autocomplete=email></div><div class=field><label>Create password</label><input id=pw type=password autocomplete=new-password></div><button class="btn primary" id=createAdmin>Create Admin Account</button></div>`;
  wire(false, home);
  createAdmin.onclick = async () => {
    if (!V("fn") || !V("ln") || !V("email") || V("pw").length < 8)
      return (m.innerHTML =
        '<div class="msg err">Complete every field and use a password of at least 8 characters.</div>');
    createAdmin.disabled = true;
    const { data, error } = await s.auth.signUp({
      email: V("email"),
      password: V("pw"),
      options: {
        emailRedirectTo: location.origin,
        data: {
          role: "admin_bootstrap",
          first_name: V("fn"),
          last_name: V("ln"),
        },
      },
    });
    createAdmin.disabled = false;
    if (error)
      return (m.innerHTML = `<div class="msg err">${E(error.message)}</div>`);
    if (data.session) return route();
    m.innerHTML =
      '<div class="msg ok">Admin account created. Confirm the email, then sign in normally.</div>';
  };
}
async function boot() {
  let q = new URLSearchParams(location.search);
  if (q.get("recovery") === "1") return recoveryScreen();
  if (q.get("admin-bootstrap") === "1") return adminBootstrapScreen();
  let {
    data: { session },
  } = await s.auth.getSession();
  if (session && localStorage.getItem("mc_pending")) {
    try {
      await finishPending(session.user.id);
    } catch (e) {
      console.error(e);
    }
  }
  return session ? route() : home();
}
async function route() {
  let {
    data: { user },
  } = await s.auth.getUser();
  if (!user) return signin();
  let { data: p } = await s
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!p) return home();
  let { data: ad } = await s
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  ad ? admin(p) : p.role === "parent" ? parent(p) : chav(p);
}
async function parent(p) {
  let [{ data: r }, { data: b }, { data: c }] = await Promise.all([
      s.from("requests").select("*").order("created_at", { ascending: false }),
      s.from("bochurim").select("*"),
      s
        .from("connections")
        .select("*")
        .order("updated_at", { ascending: false }),
    ]),
    bm = Object.fromEntries((b || []).map((x) => [x.id, x]));
  a.innerHTML =
    nav(true) +
    `<div class="w dash"><div class=row><div><div class=muted>PARENT DASHBOARD</div><h1>Welcome, ${E(p.first_name)}</h1></div><button class="btn primary" id=newreq>+ New Request</button></div><div class=stats><div class=stat>Requests<b>${r?.length || 0}</b></div><div class=stat>Connections<b>${c?.length || 0}</b></div><div class=stat>Successful<b>${(c || []).filter((x) => x.status === "successful").length}</b></div><div class=stat>Bochurim<b>${b?.length || 0}</b></div></div><h2>Your Requests</h2><div class=list>${
      (r || [])
        .map((x) => {
          let q = bm[x.bochur_id] || {};
          return `<div class=item><div class=row><div><b>${E(q.first_name || "Bochur")} • ${E(q.age || "")}</b><div class=muted>${E(x.purpose || "")} • ${E(F(x.learning_mode))} • ${E(x.location || "")}</div></div><div><span class=badge>${E(F(x.status))}</span> <button class="btn" data-matches="${x.id}">See Matches</button></div></div></div>`;
        })
        .join("") || "<div class=item>No requests yet.</div>"
    }</div><h2>Connections</h2><div class=list>${(c || []).map((x) => `<div class=item><div class=row><div><b>${E(F(x.status))}</b><div class=muted>Connection request</div></div><button class=btn data-conn="${x.id}">View</button></div></div>`).join("") || "<div class=item>No connections yet.</div>"}</div></div>`;
  wire(true);
  newreq.onclick = parentForm;
  document
    .querySelectorAll("[data-matches]")
    .forEach((x) => (x.onclick = () => showMatches(x.dataset.matches)));
  document
    .querySelectorAll("[data-conn]")
    .forEach((x) => (x.onclick = () => showConnection(x.dataset.conn)));
}
async function showMatches(requestId) {
  a.innerHTML =
    nav(true, true) +
    `<div class=card><h1>Your Matches</h1><p class=muted>We show useful profile information without exposing private identity or contact details.</p><div id=matches><div class=msg>Finding relevant Chavrusas…</div></div></div>`;
  wire(true, route);
  let { error: re } = await s.rpc("refresh_my_matches", {
    p_request_id: requestId,
  });
  if (re)
    return (matches.innerHTML = `<div class="msg err">${E(re.message)}</div>`);
  let { data, error } = await s.rpc("parent_match_cards", {
    p_request_id: requestId,
  });
  if (error)
    return (matches.innerHTML = `<div class="msg err">${E(error.message)}</div>`);
  matches.innerHTML =
    (data || [])
      .map(
        (x) =>
          `<div class=item style="margin:12px 0"><div class=row><div><h3 style="margin:0 0 6px">${E(x.display_name || "Anonymous Chavrusa")}</h3><div class=muted>${E(F(x.chavrusa_type))} • ${E(x.location || "Location not listed")} • ${E(F(x.learning_mode))}</div></div><span class=badge>${x.rate_amount ? "Approx. $" + E(x.rate_amount) + "/hr" : "Rate flexible"}</span></div>${x.parent_facing_bio ? `<p>${E(x.parent_facing_bio)}</p>` : ""}${x.languages?.length ? `<p class=privacy><b>Languages:</b> ${x.languages.map(E).join(", ")}</p>` : ""}<button class="btn primary" data-request="${requestId}" data-chav="${x.chavrusa_id}">Request Connection</button></div>`,
      )
      .join("") ||
    "<div class=msg>No suitable public match is available yet. MyChavrusa can continue looking, including privately listed profiles through the admin side.</div>";
  document
    .querySelectorAll("[data-chav]")
    .forEach(
      (x) =>
        (x.onclick = () =>
          requestConnection(x.dataset.request, x.dataset.chav, x)),
    );
}
async function requestConnection(requestId, chavrusaId, button) {
  button.disabled = true;
  button.textContent = "Sending…";
  let { error } = await s.rpc("create_connection_request", {
    p_request_id: requestId,
    p_chavrusa_id: chavrusaId,
  });
  if (error) {
    button.disabled = false;
    button.textContent = "Request Connection";
    return alert(error.message);
  }
  button.textContent = "Request Sent ✓";
  button.classList.remove("primary");
}
async function showConnection(id) {
  let { data: c, error } = await s
    .from("connections")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return alert(error.message);
  a.innerHTML =
    nav(true, true) +
    `<div class=card><h1>Connection</h1><div class=msg>Status: <b>${E(F(c.status))}</b></div><div id=cm></div>${c.status === "chavrusa_interested" ? '<button class="btn primary" id=confirm>Yes — Connect Us</button>' : ""}${["parent_confirmed", "contact_shared", "followup_pending", "successful"].includes(c.status) ? '<button class="btn primary" id=contact>Show Contact Details</button>' : ""}</div>`;
  wire(true, route);
  if (document.getElementById("confirm"))
    confirm.onclick = async () => {
      let { error } = await s.rpc("confirm_connection", {
        p_connection_id: id,
      });
      if (error)
        return (cm.innerHTML = `<div class="msg err">${E(error.message)}</div>`);
      cm.innerHTML =
        '<div class="msg ok">Confirmed. Contact details are now available.</div>';
      setTimeout(() => showConnection(id), 500);
    };
  if (document.getElementById("contact"))
    contact.onclick = async () => {
      let { data, error } = await s.rpc("connection_contact", {
          p_connection_id: id,
        }),
        x = data?.[0] || {};
      cm.innerHTML = error
        ? `<div class="msg err">${E(error.message)}</div>`
        : `<div class="msg ok"><b>${E(x.chavrusa_first_name)} ${E(x.chavrusa_last_name)}</b><br>${E(x.chavrusa_phone || "")}<br>${E(x.chavrusa_email || "")}</div>`;
    };
}
async function chav(p) {
  let [{ data: cp }, { data: i }, { data: subs }] = await Promise.all([
    s.from("chavrusa_profiles").select("*").eq("id", p.id).single(),
    s.rpc("chavrusa_incoming_requests"),
    s.from("chavrusa_subjects").select("*").eq("chavrusa_id", p.id),
  ]);
  a.innerHTML =
    nav(true) +
    `<div class="w dash"><div class=row><div><div class=muted>CHAVRUSA DASHBOARD</div><h1>Welcome, ${E(p.first_name)}</h1></div><button class="btn" id=editprof>Edit Profile</button></div>${cp && !cp.is_active ? '<div class="msg"><b>Profile submitted.</b> Your profile is waiting for MyChavrusa admin approval before it can appear in matching.</div>' : ""}<div class=stats><div class=stat>Incoming<b>${i?.length || 0}</b></div><div class=stat>Availability<b style="font-size:16px">${cp?.accepting_new_requests ? "Accepting" : "Paused"}</b></div><div class=stat>Reference<b style="font-size:16px">${E(F(cp?.reference_status))}</b></div><div class=stat>Visibility<b style="font-size:16px">${E(F(cp?.visibility))}</b></div></div><div class=item><div class=row><div><b>Your profile</b><div class=muted>${E(F(cp?.chavrusa_type))} • ${E(cp?.location || "Location not listed")} • ${E(F(cp?.learning_mode))}</div></div><span class=badge>${cp?.rate_amount ? "Approx. $" + E(cp.rate_amount) + "/hr" : "Rate flexible"}</span></div>${subs?.length ? `<p class=privacy><b>Learning:</b> ${subs.map((x) => E(x.subject + (x.gemara_styles?.length ? " - " + x.gemara_styles.join("/") : ""))).join(", ")}</p>` : ""}</div><h2>Incoming Requests</h2><div class=list>${(i || []).map((x) => `<div class=item><div class=row><div><b>${E(x.bochur_display)}${x.age ? " • Age " + E(x.age) : ""}</b><div class=muted>${E(x.location || "")} • ${E(F(x.learning_mode))}${x.purpose ? " • " + E(x.purpose) : ""}</div></div>${x.status === "parent_requested" ? `<div><button class="btn primary" data-y=${x.connection_id}>Interested</button> <button class=btn data-n=${x.connection_id}>Pass</button></div>` : `<span class=badge>${E(F(x.status))}</span>`}</div></div>`).join("") || "<div class=item>No incoming requests right now.</div>"}</div></div>`;
  wire(true);
  editprof.onclick = () => editChavrusaProfile(p, cp, subs || []);
  document
    .querySelectorAll("[data-y]")
    .forEach((x) => (x.onclick = () => respond(x.dataset.y, true)));
  document
    .querySelectorAll("[data-n]")
    .forEach((x) => (x.onclick = () => respond(x.dataset.n, false)));
}
async function editChavrusaProfile(p, cp, subs) {
  a.innerHTML =
    nav(true, true) +
    `<div class=card><h1>Edit Chavrusa Profile</h1><div id=m></div><div class=grid><div class=field><label>Location</label><input id=eloc value="${E(cp.location || "")}"></div><div class=field><label>Learning format</label><select id=emode><option value=either ${cp.learning_mode === "either" ? "selected" : ""}>Either</option><option value=in_person ${cp.learning_mode === "in_person" ? "selected" : ""}>In person</option><option value=online ${cp.learning_mode === "online" ? "selected" : ""}>Online</option></select></div><div class=field><label>Approximate rate</label><input id=erate type=number value="${E(cp.rate_amount || "")}"></div><div class=field><label>Visibility</label><select id=evis><option value=anonymous ${cp.visibility === "anonymous" ? "selected" : ""}>Recommended — anonymous match card</option><option value=first_name_visible ${cp.visibility === "first_name_visible" ? "selected" : ""}>Show first name</option><option value=private ${cp.visibility === "private" ? "selected" : ""}>Private — admin suggestions only</option></select></div></div><div class=field><label>Languages</label><input id=elangs value="${E((cp.languages || []).join(", "))}"></div><div class=field><label>A few words about your learning / experience</label><textarea id=ebio>${E(cp.parent_facing_bio || "")}</textarea></div><div class=field><label><input id=eaccept type=checkbox ${cp.accepting_new_requests ? "checked" : ""}> Accepting new requests</label></div><button class="btn primary" id=saveprof>Save Changes</button></div>`;
  wire(true, route);
  saveprof.onclick = async () => {
    let payload = {
      location: V("eloc"),
      learning_mode: V("emode"),
      rate_amount: +V("erate") || null,
      rate_type: +V("erate") ? "hourly" : "flexible",
      visibility: V("evis"),
      languages: V("elangs")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      parent_facing_bio: V("ebio"),
      experience_summary: V("ebio"),
      accepting_new_requests: document.getElementById("eaccept").checked,
    };
    let { error } = await s
      .from("chavrusa_profiles")
      .update(payload)
      .eq("id", p.id);
    if (error)
      return (m.innerHTML = `<div class="msg err">${E(error.message)}</div>`);
    m.innerHTML = '<div class="msg ok">Profile updated.</div>';
    setTimeout(route, 400);
  };
}
async function respond(id, yes) {
  let { error } = await s.rpc("respond_to_connection", {
    p_connection_id: id,
    p_interested: yes,
  });
  error ? alert(error.message) : route();
}
async function admin(p) {
  let [
      { data: cps },
      { data: ps },
      { data: rs },
      { data: bs },
      { data: cs },
      { data: refs },
    ] = await Promise.all([
      s
        .from("chavrusa_profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      s.from("profiles").select("*"),
      s.from("requests").select("*").order("created_at", { ascending: false }),
      s.from("bochurim").select("*"),
      s
        .from("connections")
        .select("*")
        .order("updated_at", { ascending: false }),
      s
        .from("references_check")
        .select("*")
        .order("created_at", { ascending: false }),
    ]),
    pm = Object.fromEntries((ps || []).map((x) => [x.id, x])),
    bm = Object.fromEntries((bs || []).map((x) => [x.id, x])),
    refsByChavrusa = Object.fromEntries(
      (refs || []).map((x) => [x.chavrusa_id, x]),
    ),
    pending = (cps || []).filter(
      (x) =>
        x.identity_status === "pending" ||
        x.reference_status === "not_contacted" ||
        x.reference_status === "contacted_pending",
    ),
    inactive = (cps || []).filter((x) => !x.is_active),
    priv = (cps || []).filter((x) => x.visibility === "private"),
    active = (rs || []).filter((x) => x.status !== "closed");
  a.innerHTML =
    nav(true) +
    `<div class="w dash"><div class=row><div><div class=muted>ADMIN DASHBOARD</div><h1>MyChavrusa Control Center</h1></div><span class=badge>Internal only</span></div><div class=stats><button class=stat data-jump=reviews>Chavrusas<b>${cps?.length || 0}</b></button><button class=stat data-jump=requests>Parent Requests<b>${active.length}</b></button><button class=stat data-jump=connections>Connections<b>${cs?.length || 0}</b></button><button class=stat data-jump=reviews>Needs Attention<b>${inactive.length}</b></button></div><h2 id=reviews>Chavrusa Review Queue</h2><p class=muted>Identity/reference information and approval controls are internal and are not shown on parent match cards.</p><div class=list>${
      inactive
        .slice(0, 20)
        .map((x) => {
          let q = pm[x.id] || {};
          const ref = refsByChavrusa[x.id];
          return `<div class=item><div class=row><div><b>${E(q.first_name || "")} ${E(q.last_name || "")}</b><div class=muted>${E(F(x.chavrusa_type))} • ${E(x.location || "")} • ${E(F(x.visibility))}</div><div class=privacy>Identity: ${E(F(x.identity_status))} • Reference: ${E(F(x.reference_status))}</div>${ref ? `<div class="internal-detail"><b>Private reference:</b> ${E(ref.full_name)}${ref.position_title ? ` • ${E(ref.position_title)}` : ""}${ref.organization ? ` • ${E(ref.organization)}` : ""}${ref.relationship ? ` — ${E(ref.relationship)}` : ""}<br>${E(ref.phone)}${ref.email ? ` • ${E(ref.email)}` : ""}</div>` : '<div class="msg err">No reference information was submitted.</div>'}</div><div>${x.identity_status !== "verified" ? `<button class=btn data-idv="${x.id}" data-ref="${x.reference_status}">ID Verified</button>` : ""} ${x.reference_status !== "checked" ? `<button class=btn data-refv="${x.id}" data-identity="${x.identity_status}" ${ref ? "" : "disabled"}>Reference Checked</button>` : ""} ${x.identity_status === "verified" && x.reference_status === "checked" ? `<button class="btn primary" data-activate="${x.id}">Approve & Activate</button>` : "<span class=badge>Complete checks first</span>"}</div></div></div>`;
        })
        .join("") || "<div class=item>No profiles waiting for approval.</div>"
    }</div><h2>Pending Verification</h2><div class=list>${
      pending
        .slice(0, 12)
        .map((x) => {
          let q = pm[x.id] || {};
          return `<div class=item><div class=row><div><b>${E(q.first_name || "")} ${E(q.last_name || "")}</b><div class=muted>${E(F(x.chavrusa_type))} • ${E(x.location || "")}</div></div><div><span class=badge>Identity: ${E(F(x.identity_status))}</span> <span class=badge>Reference: ${E(F(x.reference_status))}</span></div></div></div>`;
        })
        .join("") || "<div class=item>Nothing waiting.</div>"
    }</div><h2>Private Chavrusa Profiles</h2><p class=muted>These profiles are never shown in the normal parent match list. They are for admin-assisted suggestions.</p><div class=list>${
      priv
        .slice(0, 10)
        .map((x) => {
          let q = pm[x.id] || {};
          return `<div class=item><b>${E(q.first_name || "")} ${E(q.last_name || "")}</b><div class=muted>${E(F(x.chavrusa_type))} • ${E(x.location || "")} • ${E((x.languages || []).join(", "))}</div></div>`;
        })
        .join("") || "<div class=item>No private profiles right now.</div>"
    }</div><h2 id=requests>Parent Requests</h2><div class=list>${
      (rs || [])
        .slice(0, 12)
        .map((x) => {
          let b = bm[x.bochur_id] || {},
            q = pm[x.parent_id] || {};
          return `<div class=item><div class=row><div><b>${E(b.first_name || "Bochur")} ${E(b.last_name || "")}${b.age ? " • Age " + E(b.age) : ""}</b><div class=muted>${E(x.purpose || "")} • ${E(F(x.learning_mode))} • ${E(x.location || "")}</div><div class=privacy>Shiur: ${E(b.shiur_year || "Not listed")} • Parent: ${E(q.first_name || "")} ${E(q.last_name || "")}</div></div><div><span class=badge>${E(F(x.status))}</span> <span class="badge urgent">${E(F(x.urgency))} • Admin only</span></div></div></div>`;
        })
        .join("") || "<div class=item>No requests yet.</div>"
    }</div><h2 id=connections>Connections</h2><div class=list>${(cs || []).map(x=>`<div class=item><div class=row><div><b>${E(F(x.status))}</b><div class=muted>Updated ${E(new Date(x.updated_at).toLocaleDateString())}</div></div><span class=badge>${E(F(x.status))}</span></div></div>`).join("") || "<div class=item>No connections yet.</div>"}</div></div>`;
  wire(true);
  document.querySelectorAll("[data-jump]").forEach((b) => b.onclick=()=>document.getElementById(b.dataset.jump)?.scrollIntoView({behavior:"smooth"}));
  document.querySelectorAll("[data-idv]").forEach(
    (b) =>
      (b.onclick = async () => {
        b.disabled = true;
        let { error } = await s.rpc("admin_set_chavrusa_verification", {
          p_chavrusa_id: b.dataset.idv,
          p_identity_status: "verified",
          p_reference_status: b.dataset.ref,
          p_admin_notes: null,
        });
        if (error) return alert(error.message);
        admin(p);
      }),
  );
  document.querySelectorAll("[data-refv]").forEach(
    (b) =>
      (b.onclick = async () => {
        b.disabled = true;
        let { error } = await s.rpc("admin_set_chavrusa_verification", {
          p_chavrusa_id: b.dataset.refv,
          p_identity_status: b.dataset.identity,
          p_reference_status: "checked",
          p_admin_notes: null,
        });
        if (error) return alert(error.message);
        admin(p);
      }),
  );
  document.querySelectorAll("[data-activate]").forEach(
    (b) =>
      (b.onclick = async () => {
        b.disabled = true;
        let { error } = await s.rpc("admin_set_chavrusa_active", {
          p_chavrusa_id: b.dataset.activate,
          p_active: true,
        });
        if (error) return alert(error.message);
        admin(p);
      }),
  );
}
boot();
s.auth.onAuthStateChange(async (event, session) => {
  if (event === "PASSWORD_RECOVERY") return recoveryScreen();
  if (event === "SIGNED_IN" && session && localStorage.getItem("mc_pending")) {
    try {
      await finishPending(session.user.id);
      route();
    } catch (error) {
      console.error("Unable to complete pending submission", error);
    }
  }
});
