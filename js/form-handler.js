document.addEventListener("DOMContentLoaded", function () {
  // Инициализация SmartCaptcha
  const captchaContainer = document.getElementById("captcha-container");
  const form = document.getElementById("contactForm");
  const consentCheckbox = document.getElementById("consent");

  let captchaToken = "";

  // Клиентский ключ
  const smartCaptcha = window.smartCaptcha.render(captchaContainer, {
    sitekey: "ysc1_COEPBkHblFaZwjPcEyG606QQUUqad5fOwFtavjiB24083a65",
    callback: function (token) {
      captchaToken = token;
    },
    invisible: false, // Установите true для невидимой капчи
    hl: "ru", // Язык интерфейса капчи (по умолчанию английский)
  });

  // Обработка отправки формы
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Проверка капчи
    if (!captchaToken) {
      alert("Пожалуйста, подтвердите, что вы не робот");
      return;
    }

    // Проверка согласия на обработку персональных данных
    if (!consentCheckbox.checked) {
      alert(
        "Пожалуйста, подтвердите согласие на обработку персональных данных"
      );
      return;
    }

    // Сбор данных формы
    const formData = new FormData(form);
    formData.append("captchaToken", captchaToken);

    // Отправка данных на сервер
    try {
      const response = await fetch("your-server-endpoint", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Успешная отправка
        form.reset();
        alert("Спасибо! Ваша заявка отправлена.");

        // Сбросить токен капчи после успешной отправки
        smartCaptcha.reset();
      } else {
        // Ошибка от сервера
        alert(
          "Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз."
        );
      }
    } catch (error) {
      // Ошибка сети или другая ошибка
      console.error("Error:", error);
      alert(
        "Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз."
      );
    }
  });
});
