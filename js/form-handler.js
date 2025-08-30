document.addEventListener("DOMContentLoaded", function () {
  // Инициализация SmartCaptcha
  const captchaContainer = document.getElementById("captcha-container");
  const form = document.getElementById("contactForm");
  const consentCheckbox = document.getElementById("consent");
  const emailInput = document.getElementById("email");
  const telInput = document.getElementById("tel");

  // Элементы для ошибок
  const emailError = document.getElementById("email-error");
  const telError = document.getElementById("tel-error");
  const consentError = document.getElementById("consent-error");

  // Для валидации
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telReg = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

  let captchaToken = "";

  // Функции для работы с ошибками
  function showError(element, errorElement, message) {
      element.classList.add("error-field");
      errorElement.textContent = message;
      errorElement.classList.add("active");
  }

  function hideError(element, errorElement) {
      element.classList.remove("error-field");
      errorElement.classList.remove("active");
  }

  // Клиентский ключ
  const smartCaptcha = window.smartCaptcha.render(captchaContainer, {
    sitekey: "ysc1_COEPBkHblFaZwjPcEyG606QQUUqad5fOwFtavjiB24083a65",
    callback: function (token) {
      captchaToken = token;
    },
    invisible: false, // Установите true для невидимой капчи
    hl: "ru", // Язык интерфейса капчи (по умолчанию английский)
  });

  telInput.addEventListener('input', function(e) {
    let value = this.value.replace(/\D/g, '');
    let formattedTel = '';

    if (value.length > 0) {
      formattedTel = '+7 (';

      if (value.length > 1) {
        formattedTel += value.substring(1, 4);
      }
      if (value.length >= 4) {
        formattedTel += ') ' + value.substring(4, 7);
      }
      if (value.length >= 7) {
        formattedTel += '-' + value.substring(7, 9);
      }
      if (value.length >= 9) {
        formattedTel += '-' + value.substring(9, 11);
      }
    }

    this.value = formattedTel;
    hideError(telInput, telError);
  })

  // Валидация при потере фокуса
  emailInput.addEventListener('blur', function() {
      if (!emailReg.test(this.value)) {
          showError(this, emailError, "Введите корректный email (например: ivanov@mail.ru)");
      } else {
          hideError(this, emailError);
      }
  });

  telInput.addEventListener('blur', function() {
      if (!telReg.test(this.value)) {
          showError(this, telError, "Введите телефон в формате 79998887766");
      } else {
          hideError(this, telError);
      }
  });

  consentCheckbox.addEventListener('change', function() {
      if (this.checked) {
          hideError(this, consentError);
      }
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
      showError(consentCheckbox, consentError, "Пожалуйста, подтвердите согласие на обработку персональных данных");
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
