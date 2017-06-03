<?php
    use yii\helpers\Html;

    /* @var $this yii\web\View */
    /* @var $user app\models\User */
    /* @var $appName string */
    /* @var $confirmURL string */

?>
<table border="0" cellpadding="18" cellspacing="0" class="mcnTextContentContainer" width="100%" style="background-color: #FFFFFF;">
    <tbody>
    <tr>
        <td valign="top" class="mcnTextContent" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: left; padding: 36px; word-break: break-word;">
            <div style="text-align: center; margin-bottom: 36px">
                <?=$appName;?>
            </div>
            <div style="text-align: left; word-wrap: break-word;">Thank you for joining <?=$appName;?>! To finish signing up, you just need to confirm that we got your email right.
                <br />
                <br />To confirm your email, please click this link:
                <br /><br />
                <a href="<?=Html::encode($confirmURL);?>"><?=$confirmURL;?></a>
                <br />
                <br />Welcome and thanks!
                <br />The Team
                <div class="footer" style="font-size: 0.7em; padding: 0px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: right; color: #777777; line-height: 14px; margin-top: 36px;">© <?=date("Y");?> Company
                    <br>
                </div>
            </div>
        </td>
    </tr>
    </tbody>
</table>