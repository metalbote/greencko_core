<?php
/**
 * @file
 * Contains \Drupal\greencko_core\Form\GreenckoCoreGeneralSettingsForm.
 * TODO; For now, it is just a dummy, no actual use.
 */

namespace Drupal\greencko_core\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides the site configuration form.
 */
class GreenckoGeneralSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'greencko_core_general_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['greencko_core.general_settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    global $base_url;
    $front_page_with_welcome = $base_url . '/?welcome';

    $config = $this->config('greencko_core.general_settings');
    $form['settings']['welcome_status'] = [
      '#type' => 'checkbox',
      '#default_value' => $config->get('welcome_status'),
      '#title' => t('Allow site to show welcome message'),
      '#description' => t('This option will allow to display Greencko\'s welcome message on the homepage by adding <code>?welcome</code> to the URL. This option is automatically disabled after closing the welcome message. Check this then navigate to <a href="@front_page_with_welcome">@front_page_with_welcome</a> to see the welcome message again.', ['@front_page_with_welcome' => $front_page_with_welcome]),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('greencko_core.general_settings');
    $config->set('welcome_status', $form_state->getValue('welcome_status'));
    $config->save();
    parent::submitForm($form, $form_state);
  }
}
