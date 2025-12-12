// Build a mailto link from contact form and open user's mail client as a fallback (no server required)
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const recipient = 'info@koffurauf.example';

  function showAlert(msg){
    try{ alert(msg); }catch(e){ console.log(msg); }
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = (document.getElementById('name')||{}).value||'';
    const email = (document.getElementById('email')||{}).value||'';
    const message = (document.getElementById('message')||{}).value||'';

    if(!email || !message){
      showAlert('Please fill in your email and message.');
      return;
    }

    const subject = `Kontakt: ${encodeURIComponent(name||email)}`;
    const bodyLines = [];
    if(name) bodyLines.push(`Name: ${name}`);
    if(email) bodyLines.push(`Email: ${email}`);
    bodyLines.push('\nMessage:\n' + message);
    const body = encodeURIComponent(bodyLines.join('\n'));

    const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;

    // Try to open the user's mail client
    window.location.href = mailto;

    // Inform user what happened
    showAlert('Your mail client should open with the message. If it does not, copy the message and send it manually to ' + recipient + '.');
  });
})();
